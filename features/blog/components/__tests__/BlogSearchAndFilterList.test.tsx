import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import BlogSearchAndFilterList from '../BlogSearchAndFilterList';
import { Post } from '@/features/blog/type';

// Mock Post data
const mockPosts: Post[] = [
  {
    slug: 'post-1',
    metadata: { title: 'First Post', description: 'Description for post 1', tags: ['tech', 'react'], publishedAt: '2023-01-01', category: 'technology', emoji: '😀' },
    content: () => <div>Post 1 Content</div>,
  },
  {
    slug: 'post-2',
    metadata: { title: 'Second Adventure', description: 'Exploring new worlds', tags: ['travel', 'adventure'], publishedAt: '2023-01-02', category: 'travel', emoji: '🌍' },
    content: () => <div>Post 2 Content</div>,
  },
  {
    slug: 'post-3',
    metadata: { title: 'React Tips', description: 'Useful React tips', tags: ['react', 'javascript'], publishedAt: '2023-01-03', category: 'technology', emoji: '💡' },
    content: () => <div>Post 3 Content</div>,
  },
  {
    slug: 'post-4',
    metadata: { title: 'Culinary Journey', description: 'A taste of Italy', tags: ['food', 'travel'], publishedAt: '2023-01-04', category: 'food', emoji: '🍕' },
    content: () => <div>Post 4 Content</div>,
  },
  {
    slug: 'post-5',
    metadata: { title: 'JavaScript Basics', description: 'Learn JS fundamentals', tags: ['javascript', 'coding'], publishedAt: '2023-01-05', category: 'technology', emoji: '💻' },
    content: () => <div>Post 5 Content</div>,
  },
  {
    slug: 'post-6',
    metadata: { title: 'Advanced React Patterns', description: 'Deep dive into React', tags: ['react', 'typescript'], publishedAt: '2023-01-06', category: 'technology', emoji: '⚛️' },
    content: () => <div>Post 6 Content</div>,
  },
  {
    slug: 'post-7',
    metadata: { title: 'Another Tech Post', description: 'Tech description here', tags: ['tech'], publishedAt: '2023-01-07', category: 'technology', emoji: '🔧'},
    content: () => <div>Post 7 Content</div>,
  }
];

const POSTS_PER_PAGE = 5; // Same as in the component

describe('BlogSearchAndFilterList', () => {
  const renderComponent = (posts: Post[] = mockPosts) => {
    return render(<BlogSearchAndFilterList initialPosts={posts} />);
  };

  // Helper to get search input
  const getSearchInput = () => screen.getByPlaceholderText('Search posts...');

  // Helper to get displayed post titles
  const getDisplayedPostTitles = () => {
    const postElements = screen.queryAllByRole('article'); // Assuming BlogCard renders an <article>
    // If not <article>, need to adjust selector, e.g., by test id on BlogCard or a common class
    // For now, let's assume BlogCard has a heading with the title.
    return postElements.map(postElement => {
      const heading = within(postElement).queryByRole('heading', { level: 2 }); // Adjust level if needed
      return heading?.textContent || '';
    }).filter(title => title); // Filter out empty strings if heading not found
  };
  
  // Fallback if BlogCard structure is unknown or role 'article' is not used
   const getDisplayedPostTitlesByTextSearch = () => {
    // This is less robust, relies on titles being unique enough
    return mockPosts.filter(post => screen.queryByText(post.metadata.title)).map(p => p.metadata.title);
  };


  describe('Initial Rendering and Search Functionality', () => {
    it('renders initial posts (first page)', () => {
      renderComponent();
      const titles = getDisplayedPostTitlesByTextSearch();
      expect(titles).toHaveLength(POSTS_PER_PAGE);
      expect(titles).toEqual(mockPosts.slice(0, POSTS_PER_PAGE).map(p => p.metadata.title));
    });

    it('filters posts by title (case-insensitive)', () => {
      renderComponent();
      fireEvent.change(getSearchInput(), { target: { value: 'first post' } });
      const titles = getDisplayedPostTitlesByTextSearch();
      expect(titles).toHaveLength(1);
      expect(titles[0]).toBe('First Post');
    });
    
    it('filters posts by title "React"', () => {
      renderComponent();
      fireEvent.change(getSearchInput(), { target: { value: 'React' } });
      const titles = getDisplayedPostTitlesByTextSearch();
      // Expected: "First Post" (tag 'react'), "React Tips" (title), "Advanced React Patterns" (title)
      expect(titles).toHaveLength(3);
      expect(titles).toContain('First Post'); // Matches due to 'react' tag
      expect(titles).toContain('React Tips');
      expect(titles).toContain('Advanced React Patterns');
    });

    it('filters posts by description (case-insensitive)', () => {
      renderComponent();
      fireEvent.change(getSearchInput(), { target: { value: 'new worlds' } });
      const titles = getDisplayedPostTitlesByTextSearch();
      expect(titles).toHaveLength(1);
      expect(titles[0]).toBe('Second Adventure');
    });

    it('filters posts by tag (case-insensitive)', () => {
      renderComponent();
      fireEvent.change(getSearchInput(), { target: { value: 'travel' } });
      const titles = getDisplayedPostTitlesByTextSearch();
      // Expected: "Second Adventure", "Culinary Journey"
      expect(titles).toHaveLength(2);
      expect(titles).toContain('Second Adventure');
      expect(titles).toContain('Culinary Journey');
    });

    it('shows "no posts found" message for non-matching query', () => {
      renderComponent();
      fireEvent.change(getSearchInput(), { target: { value: 'nonexistent query' } });
      expect(screen.getByText('No posts found matching your search.')).toBeInTheDocument();
      const titles = getDisplayedPostTitlesByTextSearch();
      expect(titles).toHaveLength(0);
    });

    it('clearing search query shows initial posts again', () => {
      renderComponent();
      fireEvent.change(getSearchInput(), { target: { value: 'First' } });
      let titles = getDisplayedPostTitlesByTextSearch();
      expect(titles).toHaveLength(1);

      fireEvent.change(getSearchInput(), { target: { value: '' } });
      titles = getDisplayedPostTitlesByTextSearch();
      expect(titles).toHaveLength(POSTS_PER_PAGE);
      expect(titles).toEqual(mockPosts.slice(0, POSTS_PER_PAGE).map(p => p.metadata.title));
    });
  });

  describe('Pagination Functionality', () => {
    it('renders pagination controls if posts exceed POSTS_PER_PAGE', () => {
      renderComponent(); // mockPosts has 7 items, POSTS_PER_PAGE is 5
      expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    });

    it('does not render pagination controls if posts are less than or equal to POSTS_PER_PAGE', () => {
      renderComponent(mockPosts.slice(0, 3));
      expect(screen.queryByText(/Page \d+ of \d+/)).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Previous' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument();
    });

    it('clicking "Next" button displays the next set of posts', () => {
      renderComponent();
      fireEvent.click(screen.getByRole('button', { name: 'Next' }));
      const titles = getDisplayedPostTitlesByTextSearch();
      expect(titles).toHaveLength(mockPosts.length - POSTS_PER_PAGE); // 7 - 5 = 2
      expect(titles).toEqual(mockPosts.slice(POSTS_PER_PAGE).map(p => p.metadata.title));
      expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();
    });

    it('clicking "Previous" button displays the previous set of posts', () => {
      renderComponent();
      fireEvent.click(screen.getByRole('button', { name: 'Next' })); // Go to page 2
      fireEvent.click(screen.getByRole('button', { name: 'Previous' })); // Go back to page 1
      const titles = getDisplayedPostTitlesByTextSearch();
      expect(titles).toHaveLength(POSTS_PER_PAGE);
      expect(titles).toEqual(mockPosts.slice(0, POSTS_PER_PAGE).map(p => p.metadata.title));
      expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
    });

    it('"Previous" button is disabled on the first page', () => {
      renderComponent();
      expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
    });

    it('"Next" button is disabled on the last page', () => {
      renderComponent();
      fireEvent.click(screen.getByRole('button', { name: 'Next' })); // Go to page 2 (last page)
      expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
    });
  });

  describe('Combined Search and Pagination', () => {
    it('pagination updates correctly after a search', () => {
      renderComponent();
      // Initial: 7 posts, Page 1 of 2
      expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
      
      // Search for "tech"
      // Matches:
      // - "First Post" (tag: 'tech')
      // - "Another Tech Post" (tag: 'tech')
      fireEvent.change(getSearchInput(), { target: { value: 'tech' } });
      const titles = getDisplayedPostTitlesByTextSearch();
      expect(titles).toHaveLength(2); 
      expect(titles).toContain('First Post');
      expect(titles).toContain('Another Tech Post');
      // 2 posts, POSTS_PER_PAGE = 5, so no pagination controls
      expect(screen.queryByText(/Page \d+ of \d+/)).not.toBeInTheDocument();
    });

    it('searching resets pagination to page 1', () => {
      renderComponent();
      fireEvent.click(screen.getByRole('button', { name: 'Next' })); // Go to page 2
      expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();

      // Search for "React"
      // Matches:
      // - "First Post" (tag: 'react')
      // - "React Tips" (title)
      // - "Advanced React Patterns" (title)
      // These 3 posts should fit on page 1.
      fireEvent.change(getSearchInput(), { target: { value: 'React' } });
      const titlesAfterReactSearch = getDisplayedPostTitlesByTextSearch();
      expect(titlesAfterReactSearch).toHaveLength(3);
      expect(titlesAfterReactSearch).toContain('First Post');
      expect(titlesAfterReactSearch).toContain('React Tips');
      expect(titlesAfterReactSearch).toContain('Advanced React Patterns');

      // Check if it reset to page 1 (implicitly, as there's only one page of results)
      // 3 posts, POSTS_PER_PAGE = 5, so no pagination
      expect(screen.queryByText(/Page \d+ of \d+/)).not.toBeInTheDocument(); 
      expect(screen.queryByRole('button', { name: 'Previous' })).not.toBeInTheDocument();
    });
    
    it('pagination correctly reflects filtered results that span multiple pages', () => {
      // Need more posts or smaller POSTS_PER_PAGE for this test, or a query that returns 6+ results
      // Current mockPosts: 7. POSTS_PER_PAGE: 5.
      // Search for "Post" - matches Post 1, Post 2, Post 3, Post 4, Post 5, Post 6, Post 7 (all 7)
      // This is not a good filter for this specific test.
      // Let's search for "description" which is in Post 1, Post 7 (2 results, not good)
      // Let's search for "javascript" which is in "React Tips", "JavaScript Basics" (2 results)
      // Let's search for "a" - this will match many.
      // "First Post", "Second Adventure", "React Tips", "Culinary Journey", "JavaScript Basics", "Advanced React Patterns", "Another Tech Post" (all 7)
      renderComponent();
      fireEvent.change(getSearchInput(), { target: { value: 'a' } }); // Matches all 7 posts
      expect(getDisplayedPostTitlesByTextSearch()).toHaveLength(POSTS_PER_PAGE); // First 5 of 7
      expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: 'Next' }));
      expect(getDisplayedPostTitlesByTextSearch()).toHaveLength(2); // Remaining 2 of 7
      expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();
    });
  });
});
