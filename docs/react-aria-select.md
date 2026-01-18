React Aria Table実装におけるSelection挙動とPagination統合の包括的技術レポート
1. エグゼクティブサマリー
現代のウェブアプリケーション開発において、データグリッド（Tableコンポーネント）は情報の密度と操作性が求められる中心的なUI要素である。Adobeが提供するReact Ariaは、アクセシビリティ（a11y）と柔軟なカスタマイズ性を最優先した「ヘッドレス（Headless）」なUIプリミティブとして、多くのデザインシステムや大規模アプリケーションで採用が進んでいる。しかし、その「意見を持たない（Unopinionated）」という設計哲学ゆえに、実装者にはアーキテクチャレベルでの深い理解と、複雑な状態管理の設計責任が委ねられている。
本レポートは、React Ariaを用いてTableコンポーネントを実装する際に、開発者が最も頻繁に直面し、かつ解決が困難な課題である**「Selection（選択機能）の挙動」と「Pagination（ページネーション）の統合」**について、技術的観点から徹底的に分析したものである。特に、React Aria特有の仕様である「Select All（全選択）」時の内部状態（'all'文字列リテラル）と、ユーザーが期待する「ページ内全選択」というメンタルモデルの乖離に着目し、その解決策を提示する。
分析の結果、React Ariaの標準フックをそのまま利用するだけでは、ページネーションを伴うテーブルにおいて一般的なUX要件（ページを跨ぐ選択の維持、あるいはページ単位での一括選択）を満たすことが困難であることが判明した。本稿では、react-statelyの状態管理ロジックを解剖し、ビジネス要件に応じた3つの実装パターン（Global Select、Page Select、Hybrid）を詳述する。これにより、エンジニアリングチームは予期せぬバグやUXの破綻を防ぎ、アクセシビリティ準拠と高度な機能を両立させた堅牢なデータグリッドを構築することが可能となる。
2. React AriaとHeadless UIのアーキテクチャ概論
2.1 ヘッドレスUIの哲学と責務の分離
React Ariaを採用する上で最初に理解すべきは、それがMaterial UIやAnt Designのような「完成されたコンポーネントライブラリ」ではないという点である。React Ariaは、UIの見た目（スタイリング）を一切提供せず、機能（Behavior）、アクセシビリティ（Accessibility）、そして状態（State）のみを提供する。
このアーキテクチャは、以下の3つのレイヤーで構成されている。
パッケージ
役割
責務
react-stately
脳（State）
データの保持、選択状態の管理、コレクションの操作ロジック。UIには依存しない純粋なフック群。
react-aria
神経（Behavior）
ブラウザイベントのハンドリング、ARIA属性の生成、フォーカス管理。DOMプロパティを返すフック群。
Design System
皮膚（Render）
開発者が実装するレイヤー。Tailwind CSSやCSS-in-JSを用いてスタイリングを行い、上記フックを統合する。

Tableコンポーネントにおいて、この分離は特に重要である。例えば、行がクリックされたときに「選択状態にする」という判断はreact-statelyが行い、その結果として「スクリーンリーダーに選択を通知する」という処理はreact-ariaが担当し、「背景色を青くする」という処理は開発者が実装する。この境界線を理解していないと、状態と表示の不整合が発生しやすくなる 1。
2.2 Collection Interfaceとデータの抽象化
React AriaおよびReact Statelyは、テーブルを単なる「配列のリスト」としてではなく、Collectionという抽象化されたインターフェースとして扱う。Collectionは、リスト、ツリー、グリッドなどの反復可能なデータ構造を統一的に扱うための仕組みであり、キーボードナビゲーションやアクセシビリティの基盤となっている。
useTableStateフックは、渡されたデータ（childrenまたは動的なitems）を解析し、ノード（Node）のグラフとして内部に保持する。このノードには、一意のkeyが割り当てられる。Selection機能は、このkeyの集合（Set）として管理される。
重要なのは、**「Collectionは現在メモリ上に存在し、レンダリング対象となっているデータセットである」**という点である。クライアントサイドで全てのデータを持っている場合、Collectionは全データと等価である。しかし、サーバーサイドページネーションや無限スクロール（Infinite Scroll）を採用している場合、Collectionは「現在ロードされているデータ（部分集合）」に過ぎない。この「全データ」と「ロード済みデータ（Collection）」の不一致が、後述するSelection問題の根本原因となる 2。
3. Selection（選択機能）の内部メカニズムと落とし穴
React AriaにおけるSelectionは、SelectionManagerというクラスによって管理されており、非常に柔軟かつ強力な機能を持つ一方で、初見の開発者を混乱させる特有の仕様が存在する。
3.1 Selection Stateの二面性：Set vs String
通常、複数の項目が選択された状態を管理する場合、開発者は「選択されたIDの配列（Array）」や「IDの集合（Set）」をイメージする。しかし、React AriaのSelection型は以下のように定義されている。

TypeScript


type Selection = 'all' | Set<Key>;


この定義が示す通り、選択状態には二つのモードが存在する。
個別選択モード (Set<Key>):
ユーザーが個々の行をクリックしたり、チェックボックスを一つずつ操作した場合の状態。
選択された行のkey（ID）がSetに格納される。
開発者はstate.selectedKeysからSetを取り出し、.has(key)で判定できる。
全選択モード ('all'):
ユーザーがテーブルヘッダーの「すべて選択」チェックボックスをクリックしたり、キーボードショートカット（Cmd + A / Ctrl + A）を使用した場合の状態。
重要: この時、React Ariaは全行のキーをSetに投入するのではない。単に文字列リテラル 'all' を状態としてセットする 4。
3.1.1 なぜ 'all' が必要なのか
この設計は、大規模データセットにおけるパフォーマンスと、未ロードデータの選択を考慮したものである。
数万件のデータがあるテーブルで「すべて選択」を行った際、数万個のIDをSetにコピーする処理はブラウザのメモリとCPUを圧迫する。また、サーバーサイドページネーションや無限スクロールを行っている場合、クライアントはまだロードしていない行のIDを知らない。したがって、「全選択」という概念的な状態（Intent）を保持するために、具体的なIDのリストではなく、抽象的な 'all' というフラグを使用するのである。
3.2 開発者が陥る「型エラー」の罠
この仕様により、以下のようなナイーブな実装はランタイムエラーを引き起こす。

JavaScript


// ❌ 間違った実装例
const onSelectionChange = (keys) => {
  // keysが 'all' の場合、Array.from() は失敗するか、意図しない挙動になる
  const selectedIds = Array.from(keys); 
  performBulkDelete(selectedIds);
};


開発者は必ず、keys === 'all' のケースを分岐処理しなければならない。

JavaScript


// ✅ 正しい実装例
const onSelectionChange = (keys) => {
  if (keys === 'all') {
    // 全選択時のロジック（除外リストの管理などが必要になる場合がある）
    handleSelectAll();
  } else {
    // 個別選択時のロジック
    const selectedIds = Array.from(keys);
    handleSelection(selectedIds);
  }
};


3.3 Selection Behavior: Toggle vs Replace
React Ariaは、選択の挙動に関して2つのパターンを提供している。これはselectionBehaviorプロパティで制御される。
Behavior
挙動の概要
想定されるUX
toggle
クリックするたびに選択/非選択が反転する。フォーカス移動と選択は独立している。
チェックボックス列がある一般的なWebテーブル。タッチデバイスのデフォルト。
replace
クリックすると、以前の選択が解除され、その行のみが選択される。Ctrlキーなどを併用することで複数選択が可能。
OSのファイルエクスプローラーやデスクトップアプリケーション。マウス操作時のデフォルト（場合による）。

注意点: 一般的な業務システムのデータグリッドでは、各行にチェックボックスを表示し、クリックでON/OFFを切り替える挙動（Toggle）が期待されることが多い。しかし、React Ariaのデフォルト（特にデスクトップ環境）はreplace挙動になることがあるため、明示的にselectionBehavior="toggle"を指定しないと、「行をクリックしたら他の選択が消えた」というバグ報告につながる 6。
4. PaginationとSelectionの衝突：「All」とは何か？
「Pagination（ページネーション）」と「Select All（全選択）」を組み合わせたとき、ユーザーのメンタルモデルとReact Ariaのデータモデルの間には決定的な不一致が発生する。これが本レポートの核心部分である。
4.1 ユーザーの期待値：Gmailパターン vs Dataパターン
ページネーション付きテーブルにおける「全選択チェックボックス」の挙動には、主に2つのUXパターンが存在する 7。
Page Select（現在のページのみ選択）:
ヘッダーのチェックボックスをクリックすると、**「現在表示されているページ（例：10件）」**のみが選択される。
ページを切り替えると、選択状態は維持されるか、リセットされる（仕様による）。
全データ（例：1000件）を選択したい場合は、別途「この検索条件に一致する1000件すべてを選択する」というリンクやバナーが表示される（Gmail方式）。
Global Select（データセット全体の選択）:
ヘッダーのチェックボックスをクリックすると、**「ページングされていない全データ（例：1000件）」**が選択された状態になる。
見えていないページの行も「選択済み」として扱われる。
4.2 React Ariaのデフォルト挙動と限界
React AriaのuseTableおよびuseTableSelectAllCheckboxフックは、デフォルトで Global Select の概念に近い挙動をとる。具体的には、Collectionに含まれるすべてのキーを選択状態にする。
しかし、ここで重大な問題が発生する。**「Collectionの中身は何なのか？」**である。
ケースA：クライアントサイド・ページネーション
全データ（1000件）を一度に取得し、フロントエンドで.slice()して10件ずつ表示している場合。
React AriaのCollectionには1000件すべてのデータが含まれている。
ヘッダーのチェックボックスをクリックすると、'all'状態になり、内部的にも1000件すべてが選択対象となる。
問題点: ユーザーが「今見えている10件だけ操作したい」と思っていても、全件選択されてしまう。開発者がこれを「ページ選択」として振る舞わせるには、標準フックのバイパスが必要となる。
ケースB：サーバーサイド・ページネーション（非同期ロード）
1ページ目のデータ（10件）のみを取得し、Collectionにはその10件しか存在しない場合。
ヘッダーのチェックボックスをクリックすると、状態は'all'になる。
問題点:
onSelectionChangeで'all'が返ってくるため、開発者は「10件（ページ内全件）」なのか「1000件（サーバー上の全件）」なのかを解釈して定義しなければならない。
もしここで「ページ内全件」と解釈し、ユーザーが2ページ目に移動したとする。2ページ目のデータがロードされ、Collectionが更新される。状態が'all'のままであれば、React Ariaは**「2ページ目のデータもすべて選択状態」**としてレンダリングする（isSelected判定がtrueになるため）。
これは「ページごとに個別に選択したい」というユーザーの意図に反し、ページをめくるたびに勝手に全選択されていく挙動に見える可能性がある。
4.3 ページ遷移時の選択状態の消失（Persistence）
サーバーサイドページネーションにおいて、react-statelyのuseAsyncListやuseTableStateを使用している場合、ページ遷移（データの入れ替え）を行うと、前のページに存在していた行のデータはCollectionから消滅する。
個別選択の場合: selectedKeysにID A, B（1ページ目の項目）が入っていたとする。2ページ目に遷移してデータが K, L に入れ替わったとき、SelectionManagerは「存在しないキー」を選択状態として保持し続けることができるか？
基本的には保持される（Setの中にキーが残る）。
しかし、UI上は表示されないため、ユーザーは「自分が何を選択中なのか」を見失うリスクがある。
また、API設計によっては「存在しないキー」が自動的にクリーンアップされる場合もあるため、selectedKeysの状態をテーブルの外側（親コンポーネントやGlobal State）に持ち上げる（Lift State Up）設計が推奨される 4。
5. 実装戦略とコードレシピ
上述の課題を解決し、要件に応じたテーブルを実装するための3つの戦略を提示する。
戦略A：Global Select（Adobe推奨/標準準拠）
「全選択」＝「データベース上の全件選択」とするパターン。SaaSの管理画面などで、一括削除や一括更新を行いたい場合に適している。
実装のポイント
useTableSelectAllCheckboxを使用する: 標準のフックをそのまま利用し、チェックボックスをレンダリングする。
'all'状態のハンドリング:
APIリクエスト時にIDのリストを送るのを諦める。
代わりに、「現在の検索フィルター条件（Filter Query）」と「除外リスト（Exclude IDs）」を送信する設計にする。
除外ロジックの実装:
ユーザーが全選択（'all'）した後に、特定の行（ID: 5）だけチェックを外した場合、React Ariaの状態管理はどうなるか？
SelectionManagerは内部的に「全選択モード」かつ「除外キーセット: {5}」という状態を持つことができるが、selectedKeysとして外部に公開される値がどう表現されるかはバージョンや設定による。多くの場合、'all'のままか、あるいは複雑なオブジェクトになる可能性がある。
APIペイロード例：
JSON
{
    "action": "delete",
    "scope": "all_matching_filter",
    "filter": { "status": "active" },
    "exclude_ids": ["5", "12"]
}


このパターンの欠点は、バックエンドAPIが複雑な「除外ロジック」に対応している必要がある点である 10。
戦略B：Page Select（ユーザー期待値重視）
「全選択」＝「現在のページのみ選択」とするパターン。多くのWebアプリケーションで採用されている一般的な挙動。React Ariaでこれを実現するには、標準機能をバイパスするカスタム実装が必須となる。
実装手順とコードレシピ
この戦略では、ヘッダーのチェックボックスに slot="selection" や useTableSelectAllCheckbox を使用してはいけない。これらを使うと、強制的にGlobal Select ('all') モードに入ってしまうからである 12。
Stateの完全制御:
selectedKeysをControlled Componentとして扱い、親コンポーネントでSet<Key>として管理する。'all'文字列は一切使用しない。
カスタムヘッダーチェックボックスの実装:
ヘッダーセル内に、通常のCheckboxコンポーネントを配置し、そのisSelectedとisIndeterminateを自分で計算する。

TypeScript


// 概念実証コード（TypeScript）

// 1. 現在のページのID一覧を取得（ページネーション済みデータ）
const currentPageIds = items.map(item => item.id);

// 2. ページ内の行がどれだけ選択されているか計算
const selectedInPageCount = currentPageIds.filter(id => selectedKeys.has(id)).length;

// 3. ヘッダーチェックボックスの状態決定
const isAllSelected = currentPageIds.length > 0 && selectedInPageCount === currentPageIds.length;
const isIndeterminate = selectedInPageCount > 0 && selectedInPageCount < currentPageIds.length;

// 4. ハンドラーの実装
const handleSelectPage = () => {
  const newSelection = new Set(selectedKeys);
  
  if (isAllSelected) {
    // ページ内全解除
    currentPageIds.forEach(id => newSelection.delete(id));
  } else {
    // ページ内全選択（未選択のものだけ追加）
    currentPageIds.forEach(id => newSelection.add(id));
  }
  
  setSelectedKeys(newSelection);
};

// 5. レンダリング
<Table>
  <TableHeader>
    <Column>
      {/* 標準のSelect Allではなく、手動制御のチェックボックス */}
      <Checkbox 
        isSelected={isAllSelected}
        isIndeterminate={isIndeterminate}
        onChange={handleSelectPage}
        aria-label="現在のページの項目をすべて選択"
      />
    </Column>
    {/* 他の列 */}
  </TableHeader>
  {/*... */}
</Table>


メリットとデメリット
メリット: ユーザーのメンタルモデルと一致する。APIには常にIDリストを送信すればよいため、バックエンド実装がシンプルになる。
デメリット: ページ数が多い場合、ユーザーが全ページを手動でめくって選択する必要がある。「全5000件を一括削除」のような機能は別途UI（ボタンなど）を用意する必要がある。また、アクセシビリティ対応（aria-labelなど）を自前で記述する責任が生じる 13。
戦略C：Hybrid（Gmail方式）
戦略Bを基本としつつ、全選択された場合に「全データを選択しますか？」というバナーを表示する高度なUI。
初期状態は戦略B（Page Select）で動作。
ページ内全選択が行われた場合、テーブル上部または下部にメッセージを表示する。
UI: 「このページの10件が選択されています。データセット内の全1000件を選択する」
リンクがクリックされたら、selectedKeysを'all'（文字列）に切り替える。
テーブルのUIは'all'モードに応答し、全行チェック済み表示になる。
API送信時は、'all'かどうかでペイロード構造を切り替える（戦略Aと同じAPIロジックが必要）。
6. 技術的詳細：PaginationにおけるStateの永続化と罠
ページネーションの実装において、React StatelyのuseAsyncListを使用する場合と、TanStack Query (React Query) などの外部ライブラリを使用する場合で、注意点が異なる。
6.1 useAsyncList と Cache Invalidation
react-statelyのuseAsyncListは、リストデータのロード、ソート、ページネーションを管理する便利なフックである。しかし、これは「表示用データ」の管理に特化している側面が強い。
問題: ページ遷移時に新しいデータをロードすると、古いデータはメモリから破棄される（キャッシュ設定によるが、基本的には入れ替わる）。
選択の維持: selectedKeysがuseTableStateの外側（親）で管理されていれば、データが消えてもID自体はSetに残る。しかし、ユーザーが前のページに戻った時、その行が正しく「選択済み」として表示されるには、行のkeyが完全に一致している必要がある。
Keyの安定性: 配列のインデックス（index）をKeyにしてはいけない。
1ページ目の1行目＝Index 0。
2ページ目の1行目＝Index 0。
もしIndexをKeyにしていると、ページをめくった瞬間、前のページの選択状態が次のページの同じ位置の行に「亡霊」のように引き継がれてしまう。
必ず、データベースの主キー（UUIDなど）をrow.keyとして使用すること 15。
6.2 選択解除のUXと状態不整合
サーバーサイドページネーションかつ「ページ跨ぎ選択（Cross-page selection）」を許可する場合（戦略B）、以下のシナリオが発生する。
ユーザーがP1で3件選択。
P2で2件選択。
現在、selectedKeysには5件のIDがある。
ユーザーは「自分が何を選んだか」を確認する方法がない（現在表示されていないため）。
この状態で一括操作を実行するのは危険である。
推奨UIパターン:
ページを跨ぐ選択を許可する場合は、テーブルの外側に「現在5件選択中（内訳を表示）」というフローティングバーやサマリー表示を実装し、選択済みアイテムのリストを確認・解除できるドロワーなどを提供すべきである。React AriaはこのUIを提供しないため、自前で実装する必要がある。
7. アクセシビリティ（A11y）への配慮
React Ariaを採用する最大の動機であるアクセシビリティについても、独自実装を行う際には細心の注意が必要である。
7.1 スクリーンリーダーへの通知
Select Allの通知: 標準のuseTableSelectAllCheckboxを使わない場合（戦略B）、チェックボックスに適切なaria-labelを付与する必要がある。単に「Select All」ではなく、「Select all rows on current page（現在のページの行をすべて選択）」のように、範囲を明確にするラベルが望ましい 13。
ページ遷移時のフォーカス: ページネーションボタンを押してデータが入れ替わった後、フォーカスはどこに行くべきか？
一般的には、テーブルの先頭行、または「次のページ」ボタン自体に留まることが許容される。
しかし、フォーカスしていた行がDOMから消滅するため、明示的にフォーカス管理を行わないとフォーカスロスト（document.bodyへの移動）が発生し、スクリーンリーダーユーザーを迷子にさせるリスクがある。
React AriaのuseEffectなどで、データロード完了後に適切な要素へフォーカスを戻す処理を検討すべきである。
7.2 aria-current の活用
ページネーションコンポーネント自体（番号付きリンクなど）には、現在のページを示すために aria-current="page" 属性を付与することがWAI-ARIAのベストプラクティスである。aria-selected="true" は選択可能なアイテム（タブやグリッドの行）に使われるものであり、ページネーションの現在地表示に使うべきではない 16。
8. 結論と推奨事項
React AriaでのTable実装におけるSelectionとPaginationの統合は、単なるプロパティ設定では完了しない高度なアーキテクチャ設計課題である。
推奨チェックリスト
要件定義の明確化:
「全選択」はページ内のみか、データセット全体か？（これが最大の分岐点）
ページを跨いだ選択維持は必要か？
実装パターンの選択:
通常の管理画面: **戦略B（Page Select + 手動チェックボックス）**を推奨する。ユーザーの誤操作リスクが最も低く、実装の予測可能性が高い。
大量データの処理ツール: **戦略A（Global Select）または戦略C（Hybrid）**を検討するが、バックエンドAPIの改修コストを見積もる必要がある。
データ構造の設計:
必ず一意かつ不変のID（UUID等）をKeyに使用する。
Selection型が 'all' 文字列になり得ることを常に想定し、型ガードを実装する。
状態の持ち上げ（Lift State Up）:
ページネーションやフィルタリングを行っても選択状態を維持したい場合、selectedKeysはuseTableStateよりも上位のコンポーネント（あるいはContext）で管理する。
React Ariaは強力なツールであるが、それは「魔法の杖」ではなく「精密な部品セット」である。特にSelectionの'all'挙動は、その設計思想（アクセシビリティと大規模データ対応）を理解していないとバグの温床となる。本レポートで示した戦略に基づき、意図したUXとコードの挙動を一致させることが、成功への鍵である。
付録：技術参照用データ
比較：主要ライブラリにおけるPaginationとSelectionのデフォルト挙動

ライブラリ
デフォルトのSelect All挙動
状態の持ち方
Paginationとの連携
React Aria
Global ('all' 文字列)
Set<Key> | 'all'
疎結合（開発者が統合）
MUI DataGrid
Global (ただし設定で変更可)
IDの配列
密結合 (checkboxSelectionVisibleOnlyプロパティあり) 18
TanStack Table
Global
行オブジェクトの状態マップ
パイプライン処理で制御可能
Ant Design
Page (デフォルト)
IDの配列 (selectedRowKeys)
ページ遷移でリセットされる挙動が標準的（設定可）

Selectionモードのステート遷移図（概念）

コード スニペット


graph TD
    A -->|行クリック| B
    B -->|行クリック| B
    B -->|全選択クリック| C{実装パターンは?}
    
    C -->|戦略A: Default| D[Global All ('all' string)]
    C -->|戦略B: Custom| E
    
    D -->|1行解除| F[Global All with Exclusions]
    E -->|ページ遷移| G
    
    G -->|新規ページで全選択| H


以上。
引用文献
TableView – V3 - React Spectrum - Adobe, 1月 18, 2026にアクセス、 https://react-spectrum.adobe.com/v3/TableView.html
Table | React Aria - Adobe, 1月 18, 2026にアクセス、 https://react-aria.adobe.com/Table
Collection components – V3 - React Spectrum - Adobe, 1月 18, 2026にアクセス、 https://react-spectrum.adobe.com/v3/collections.html
Selection | React Aria - Adobe, 1月 18, 2026にアクセス、 https://react-aria.adobe.com/selection
Selection – V3 - React Spectrum - Adobe, 1月 18, 2026にアクセス、 https://react-spectrum.adobe.com/v3/selection.html#select-all
useTable – Table - React Aria, 1月 18, 2026にアクセス、 https://react-aria.adobe.com/Table/useTable
checkboxes - Correct "Select all" pattern - User Experience Stack Exchange, 1月 18, 2026にアクセス、 https://ux.stackexchange.com/questions/116949/correct-select-all-pattern
The bulk experience: exploring multi-select and bulk actions | by Mendy Gee | UX Collective, 1月 18, 2026にアクセス、 https://uxdesign.cc/the-bulk-experience-7fcca8080f82
Retain Selection across pages · Issue #1921 · mbrn/material-table - GitHub, 1月 18, 2026にアクセス、 https://github.com/mbrn/material-table/issues/1921
Delete objects in bulk/batch from Object Storage - Oracle Help Center, 1月 18, 2026にアクセス、 https://docs.oracle.com/en/learn/oci-bulk-delete-objects/
Bulk index or delete documents | Elasticsearch API documentation, 1月 18, 2026にアクセス、 https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-bulk
Table | React Aria, 1月 18, 2026にアクセス、 https://react-spectrum.adobe.com/react-aria/Table.html
How can I set the labels of Material-Table selection checkboxes? - Stack Overflow, 1月 18, 2026にアクセス、 https://stackoverflow.com/questions/76707668/how-can-i-set-the-labels-of-material-table-selection-checkboxes
Table select all with custom checkbox misbehaving · Issue #3789 · adobe/react-spectrum, 1月 18, 2026にアクセス、 https://github.com/adobe/react-spectrum/issues/3789
react-spectrum/packages/@react-stately/data/src/useAsyncList.ts at main - GitHub, 1月 18, 2026にアクセス、 https://github.com/adobe/react-spectrum/blob/main/packages/%40react-stately/data/src/useAsyncList.ts
Should aria-current="page" be used for a client-side table pagination component?, 1月 18, 2026にアクセス、 https://stackoverflow.com/questions/74708434/should-aria-current-page-be-used-for-a-client-side-table-pagination-component
ARIA: aria-selected attribute - MDN Web Docs - Mozilla, 1月 18, 2026にアクセス、 https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-selected
Data Grid - Row selection - MUI X, 1月 18, 2026にアクセス、 https://mui.com/x/react-data-grid/row-selection/
