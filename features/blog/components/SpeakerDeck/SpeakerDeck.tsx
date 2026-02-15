type SpeakerDeckProps = {
  /** SpeakerDeck の data-id（プレゼンテーション固有のID） */
  dataId: string;
  /** アスペクト比（デフォルト: 16:9） */
  ratio?: number;
  /** スライドのタイトル（アクセシビリティ用） */
  title?: string;
};

export function SpeakerDeck({
  dataId,
  ratio = 16 / 9,
  title = "SpeakerDeck Embed",
}: SpeakerDeckProps) {
  return (
    <div
      className="not-prose relative w-full overflow-hidden rounded-lg"
      style={{ aspectRatio: ratio }}
    >
      <iframe
        className="absolute inset-0 h-full w-full border-0"
        src={`https://speakerdeck.com/player/${dataId}`}
        title={title}
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
