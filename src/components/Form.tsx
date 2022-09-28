import React from 'react';
import { useEffect, useState } from 'react';
import FormErrorMessage from './FormErrorMessage';
import Input from './Input';
import Select from './Select';
import TextArea from './TextArea';
const Form: React.FC<{ name?: string }> = () => {
    /* States */
    const [isSendFormButtonDisabled, setIsFormButtonDisabled] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string>();
    const [errors, setErrors] = useState<{
        name?: string;
        email?: string;
        restaurant?: string;
        message?: string;
    }>();
    const [okMessage, setOkMessage] = useState<string>();
    const [emailError, setEmailError] = useState<string>();
    /* Private Functions */
    const checkValidity = (inputName: string, inputValue: string) => {
        switch (inputName) {
            case "email":
                const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
                return pattern.test(inputValue);
            case "name":
                return inputValue.length > 0;
            case "restaurant":
                return inputValue.length > 0;
            case "message":
                return inputValue.length > 0;
            default:
                return true;
        }
    };
    const sendEmail = (e: any) => {
        console.log('e', e);
        e.preventDefault();
        let error = false;
        for (const i of e.target) {
            if (!checkValidity(i.name, i.value)) {
                error = true;
                setErrors((prevValue) => {
                    return {
                        ...prevValue,
                        [i.name]: 'Porfavor complete el campo!',
                    }
                })
                const element = document.getElementById(i.name)
                element?.classList.add("is-invalid");
            }
            else {
                if (i.name) {
                    document.getElementById(i.name)?.classList?.remove("is-invalid");
                }
            }
        }
        // Define error message
        if (error) {
            setErrorMessage('Error!');
        }
        else {
            // Send the email
            // emailjs.sendForm('service_6qhzoqo', 'template_ywqehmy', e.target)
            //     .then((result) => {
            //         for (let field of e.target) {
            //             let element = document.getElementById(field.name);
            //             if (element != null) {
            //                 // element.value = ""; Commenting for now because it throws error
            //             }
            //             setOkMessage('¡Enviado con Éxito!');
            //         }
            //     },
            //         (error) => {
            //             setEmailError('error!');
            //         });
        }
    }
    const onChange = (value: any) => {
        if (value) setIsFormButtonDisabled(false);
        else setIsFormButtonDisabled(true);
    }

    return (
        <div className={'bg-form bg-no-repeat bg-cover'}>
            <div className="container mx-auto">
                <div className="flex justify-center p-4 md:p-0">
                    <div className={'flex flex-col gap-y-8'}>
                        <form onSubmit={sendEmail}>
                            {/* Datos de Contacto */}
                            <h4 className='text-[#343434] font-bold text-2xl'>Datos de contacto</h4>
                            <div>
                                <Input name={'name'} placeholder='Nombre y Apellido' />
                                <FormErrorMessage>
                                    {errors?.name}
                                </FormErrorMessage>
                            </div>
                            <div className={'m-3'} />
                            <div>
                                <Input name={'email'} placeholder='Correo eletrónico' />
                                <FormErrorMessage>
                                    {errors?.email}
                                </FormErrorMessage>
                            </div>
                            <div className={'m-3'} />
                            <div className='flex flex-row justify-between gap-4'>
                                <div>
                                    <Input name={'cp'} placeholder='Cód.área' />
                                </div>
                                <div>
                                    <Input name={'phone'} placeholder='Teléfono' />
                                </div>
                            </div>
                            {/* Datos del Comercio */}
                            <div className={'p-3'} />
                            <h4 className='text-[#343434] font-bold text-2xl'>Datos del comercio</h4>
                            <div className={'p-1'} />
                            <div>
                                <Input name={'restaurant'} placeholder='Nombre de la empresa' />
                                <FormErrorMessage>
                                    {errors?.restaurant}
                                </FormErrorMessage>
                                {/* Ubicación */}
                                <div className={'p-3'} />
                                <div className='flex flex-row'>
                                    <div className={'basis-1/2'}>
                                        <h4 className='text-[#343434] font-bold text-lg'>Argentina</h4>
                                        <Select name={'country'} options={[{ label: 'Argentina', value: 'Argentina' }]} />
                                    </div>
                                    <div className={'p-2'} />
                                    <div className={'basis-1/2'}>
                                        <h4 className='text-[#343434] font-bold text-lg'>Provincia</h4>
                                        <Select name={'locality'} options={[{ label: 'Córdoba', value: 'Córdoba' }]} />
                                    </div>
                                </div>
                                {/* Consulta */}
                                <div className={'p-3'} />
                                <div>
                                    <h4 className='text-[#343434] font-bold text-2xl'>Consulta</h4>
                                </div>
                                <div>
                                    <TextArea name={'message'} placeholder='Mensaje' rows={10} />
                                    <FormErrorMessage>
                                        {errors?.message}
                                    </FormErrorMessage>
                                </div>
                                <div className="font-bold text-green-600 font-3xl text-left pb-2">
                                    {okMessage}
                                </div>
                                <div className="error-msg">
                                    {emailError}
                                    {errorMessage}
                                </div>
                                <div className={'p-3'} />
                                <button className={`w-full transition-colors bg-c-yellow font-bold text-white p-2 rounded-[30px] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]`}>Enviar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Form;