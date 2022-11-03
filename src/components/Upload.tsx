import Image from "next/image";
import React, { useState } from "react"
import { UseFormReturn } from "react-hook-form";
import { v4 as uuid } from 'uuid';
interface UploadProps {
    label: string;
    form: UseFormReturn<any, any>
}

const Upload: React.FC<UploadProps> = ({ label, form }) => {
    const [imageUrl, setImageUrl] = useState<string>();
    const uploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            if (e.target.files[0]) {
                const file = e.target.files[0]
                const extention = file.name.split('.').pop();
                const filename = encodeURIComponent(`${uuid()}.${extention}`)
                const fileType = encodeURIComponent(file.type)

                const res = await fetch(
                    `/api/upload-url?file=${filename}&fileType=${fileType}`
                )
                const { url, fields } = await res.json()
                const formData = new FormData()

                Object.entries({ ...fields, file }).forEach(([key, value]) => {
                    formData.append(key, value as string)
                })

                const upload = await fetch(url, {
                    method: 'POST',
                    body: formData,
                })
                const imageUrl = `https://cacao-whatsapp-tesis.s3.amazonaws.com/${fields.key}`
                form.setValue('imageUrl', imageUrl);
                setImageUrl(imageUrl)
                if (upload.ok) {
                    console.log('Uploaded successfully!')
                } else {
                    console.error('Upload failed.')
                }
            }
        }
    }
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            {
                imageUrl ? (
                    <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                        <div className="space-y-1 text-center">
                            <input
                                hidden
                                {...form.register('imageUrl')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                            <Image src={imageUrl} height={150} width={150} alt={'Foto del producto'} className='rounded-xl' />
                            <div className="flex text-sm text-gray-600">
                                <label
                                    htmlFor="file-upload"
                                    className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                                >
                                    <span>Cambiar foto</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/png, image/jpeg" onChange={uploadPhoto} />
                                </label>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                        <div className="space-y-1 text-center">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 48 48"
                                aria-hidden="true"
                            >
                                <path
                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                                <label
                                    htmlFor="file-upload"
                                    className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                                >
                                    <span>Sube una foto</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/png, image/jpeg" onChange={uploadPhoto} />
                                </label>
                                <p className="pl-1">o arrastrala</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, hasta 10MB</p>
                        </div>
                    </div>
                )
            }

        </div>
    )
}

export default Upload;