
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import type { ControllerRenderProps, Noop,} from "react-hook-form";
import { BsCloudUpload } from "react-icons/bs";
import type { PetValues} from "~/pages/addPet";
export interface MediaData extends Blob {
  name:string
}


const Dropzone=({ field, onBlur, }: {
  onBlur: Noop,
  field: ControllerRenderProps<PetValues, "images">
}) => {
  const [files, setFiles] = useState<((MediaData ) & { preview: string, })[]>([]);
  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    accept: {
      'image/*': []
    },
    onDrop: (acceptedFiles: MediaData[] ) => {
   
      field.onChange(acceptedFiles);
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      
      })));
    }
  });
  
  const thumbs = files.map(file => (
    <div className='inline-flex border-2 border-slate-300 rounded mb-2 mr-2 w-16 h-16 lg:w-24 lg:h-24 p-1 border-box' key={file.name}>
      <div className='flex overflow-hidden '>
        <img
        alt="pet"
          src={file.preview}

         className='block w-auto h-full'
          // Revoke data uri after image is loaded
          onLoad={() => { URL.revokeObjectURL(file.preview) }}
        />
      </div>
    </div>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);
    return (
        <section className=" item-center   flex h-fit min-h-28   w-full flex-col rounded-md  border-2 border-dashed border-[hsl(var(--bc) / var(--tw-border-opacity))] bg-base-100 py-4 px-2 ">
        <div

          {...getRootProps({ className: "dropzone" })}
          className="cursor-pointer  "
        >

<input {...getInputProps({ onBlur })} />
          <div className="flex w-full flex-row items-center justify-center gap-3 align-baseline">
            <BsCloudUpload className="text-xl" />{" "}
          
             { isDragActive? <p className="text-green-500">Drop them here!</p>: <p>Drag & drop files here, or click to select files</p>}
       
          </div>
        </div>
        <aside className="mt-2 flex flex-row flex-wrap h-fit w-full  md:mt-6">
    
   
         {thumbs}
        </aside>
      </section>
    );
};


export default Dropzone