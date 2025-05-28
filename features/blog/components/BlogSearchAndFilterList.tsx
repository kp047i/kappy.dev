"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Post } from '@/features/blog/type';
import SearchInput from './SearchInput';
import { BlogCard } from './BlogCard/BlogCard';

const POSTS_PER_PAGE = 5;

interface BlogSearchAndFilterListProps {
  initialPosts: Post[];
}

const BlogSearchAndFilterList: React.FC<BlogSearchAndFilterListProps> = ({ initialPosts }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [processedPosts, setProcessedPosts] = useState<Post[]>(initialPosts); // Posts after search/filter
  const [currentPage, setCurrentPage] = useState(1);

  const memoizedInitialPosts = useMemo(() => initialPosts, [initialPosts]);

  useEffect(() => {
    // Filter posts based on search query
    const lowerCaseQuery = searchQuery.toLowerCase();
    const newFilteredPosts = searchQuery
      ? memoizedInitialPosts.filter(post => {
          const titleMatch = post.metadata.title.toLowerCase().includes(lowerCaseQuery);
          const descriptionMatch = post.metadata.description?.toLowerCase().includes(lowerCaseQuery);
          const tagMatch = post.metadata.tags?.some(tag => tag.toLowerCase().includes(lowerCaseQuery));
          return titleMatch || descriptionMatch || tagMatch;
        })
      : memoizedInitialPosts;
    
    setProcessedPosts(newFilteredPosts);
    setCurrentPage(1); // Reset to first page whenever search or initial posts change
  }, [searchQuery, memoizedInitialPosts]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Pagination logic
  const totalPages = Math.ceil(processedPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPostsToDisplay = processedPosts.slice(startIndex, endIndex);

  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <div>
      <SearchInput onSearch={handleSearch} />
      {currentPostsToDisplay.length === 0 && (
        <p className="text-center text-gray-500 py-4">
          {searchQuery ? "No posts found matching your search." : "No posts to display."}
        </p>
      )}
      <div className="space-y-12">
        {currentPostsToDisplay.map((post) => (
          <BlogCard key={post.slug} metadata={post.metadata} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogSearchAndFilterList;
