'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Input } from './ui/input';
import { usePathname, useSearchParams } from 'next/navigation';
import { Models } from 'node-appwrite';
import { getFiles } from '@/lib/actions/file.actions';
import Thumbnail from './Thumbnail';
import FormattedDateTime from './FormattedDateTime';
import { useRouter } from 'next/navigation';
import {useDebounce} from 'use-debounce';

const Search = () => {
  const [query, setQuery] = useState('');
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('query') || '';
  const [results, setResults] = useState<Models.Document[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const path = usePathname();
  const [debouncedQuery] = useDebounce(query, 500);

  useEffect(() => {
    const fetchFiles = async () => {
      if (debouncedQuery.length === 0) {
        setResults([]);
        setOpen(false);

        return router.push(path.replace(searchParams.toString(), ''));
      }

      const files = await getFiles({
        types: [],
        searchText: debouncedQuery,
      });

      setResults(files.documents);
      setOpen(true);
    };

    fetchFiles();
  }, [debouncedQuery]);

  useEffect(() => {
    if (!searchQuery) {
      setQuery('');
    }
  }, []);

  const handleClickItem = (file: Models.Document) => {
    setOpen(false);

    setResults([]);

    router.push(
      `/${file.type === 'video' || file.type === 'audio' ? 'media' : file.type + 's'}?query=${query}`
    );
  };

  return (
    <div className="search">
      <div className="search-input-wrapper">
        <Image src="/assets/icons/search.svg" alt="search" width={24} height={24} />
        <Input
          value={query}
          placeholder="Search"
          className="search-input"
          onChange={(e) => setQuery(e.target.value)}
        />
        {open && (
          <ul className="search-result">
            {results.length > 0 ? (
              results.map((file) => (
                <li
                  className="flex items-center justify-between"
                  key={file.$id}
                  onClick={() => handleClickItem(file)}
                >
                  <div className="flex cursor-pointer items-center gap-4">
                    <Thumbnail type={file.type} extension={file.extension} url={file.url} />
                    <p className="subtitle-2 line-clamp-1 text-light-100">{file.name}</p>
                  </div>

                  <FormattedDateTime
                    date={file.$createdAt}
                    className="caption line-clamp-1 text-light-200"
                  />
                </li>
              ))
            ) : (
              <p className="empty-result">No files found</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Search;
