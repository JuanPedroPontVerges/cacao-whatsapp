import Script from 'next/script';
import React, { useRef, useState } from 'react';
import { useFormContext } from "react-hook-form";
import { env } from '../env/client.mjs';

const AutoCompleteLocationOptions: React.FC<{ name?: string }> = () => {
    const { register, setValue } = useFormContext();
    // State
    const autoCompleteRef = useRef<HTMLInputElement>(null);
    const [googlePlaceId, setGooglePlaceId] = useState<string>()

    const initAutocomplete = (inputField: any, opts?: google.maps.places.AutocompleteOptions | null | undefined) => {
        const autoComplete = new google.maps.places.Autocomplete(inputField, opts || undefined);
        const infowindow = new google.maps.InfoWindow();
        const infowindowContent = document.getElementById('infowindow-content') as HTMLElement;
        infowindow.setContent(infowindowContent);
        autoComplete.addListener('place_changed', () => {
            const place = autoComplete.getPlace();
            if (place.place_id) {
                setGooglePlaceId(place.place_id);
            }
            if (place.vicinity) {
                // setAddress(place.vicinity)
                setValue('address', place.vicinity)
            }
        });

    };

    const onChange = () => {
        if (autoCompleteRef.current) {
            initAutocomplete(autoCompleteRef.current, {
                types: ['establishment'],
                componentRestrictions: { country: ['ar'] },
            });
        }
    };

    return (
        <>
            <div className="col-span-6">
                <label htmlFor="street-address" className="block text-sm font-medium text-gray-700">
                    Nombre de su negocio
                </label>
                <input
                    autoComplete='off'
                    onChange={onChange}
                    ref={autoCompleteRef}
                    type="text"
                    name="street-address"
                    id="street-address"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <div className="col-span-6">
                <label htmlFor="street-address" className="block text-sm font-medium text-gray-700">
                    Street address
                </label>
                <input
                    type="text"
                    disabled
                    id="street-address"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-200"
                    {...register('address')}
                />
            </div>
            <Script
                src={`https://maps.googleapis.com/maps/api/js?key=${env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`}
                onError={(err) => {
                    console.log('err', err);
                }}
            />
        </>
    );
};
export default AutoCompleteLocationOptions;
