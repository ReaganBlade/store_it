import Card from '@/components/Card';
import Sort from '@/components/Sort';
import { getFiles } from '@/lib/actions/file.actions';
import { Models } from 'node-appwrite';
import React from 'react';

const page = async ({ searchParams, params }: SearchParamProps) => {
  const type = ((await params)?.type as string) || '';
  const searchText = ((await searchParams)?.query as string) || '';
  const sort = ((await searchParams)?.sort as string) || '';

  const types = getFileTypeParams(type) as FileType[];

  const files = await getFiles({ types, searchText, sort });
  // console.log(files);

  return (
    <div className="page-container">
      <section className="w-full">
        <h1 className="h1 capitalize">{type}</h1>
        <div className="total-size-section">
          <p className="body-1">
            Total: <span className="h5">{`0 MB`}</span>
          </p>
          <div className='sort-container'>
            <p className="body-1 hidden sm:block">Sort by: </p>
            <Sort />
          </div>
        </div>0 MB
      </section>
      {
        files.total > 0 ? (
          <section className='file-list'>
            {
              files.documents.map((file: Models.Document) => (
                <Card key={file.$id} file={file}/>
              ))
            } 
          </section>
        ) : <p> No Queries</p>
      }
    </div>
  );
};

export default page;

function getFileTypeParams(type: string): FileType[] {
  switch (type){
    case "documents":
      return ["document"];
    case "images":
      return ["image"];
    case "media":
      return ["video", "audio"];
    case "others":
      return ["other"];
    default:
      return ["document"];
  }
}

