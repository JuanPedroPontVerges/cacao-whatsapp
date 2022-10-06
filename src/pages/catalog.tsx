import { Disclosure, Switch } from "@headlessui/react";
import { ChevronUpIcon, TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../components/Button";
import Drawer from "../components/Drawer";
import Form from "../components/Form";
import Modal from "../components/Modal";
import Table from "../components/Table";
import { getServerAuthSession } from "../server/common/get-server-auth-session";
import { trpc } from "../utils/trpc";

const productColumns = [
    { title: 'Nombre', dataIndex: 'name' },
    { title: 'Apellido', dataIndex: 'name' }
]

const dataSource = [
    { title: 'Juan Pedro' },
    { title: 'Juan Pedro' },
    { title: 'Juan Pedro' },
    { title: 'Juan Pedro' },
]


const Catalog: NextPage = () => {
    const { data } = useSession();
    const userQuery = trpc.useQuery(["userRouter.getVenues", { id: data?.user?.id }]);
    const categoryQuery = trpc.useQuery(["categoryRouter.findCategoriesByMenuId", { id: userQuery.data?.venue?.menus[0]?.id }])
    const optionGroupQuery = trpc.useQuery(["optionGroupRouter.findOptionGroupsByMenuId", { id: userQuery.data?.venue?.menus[0]?.id }])
    const categoryMutation = trpc.useMutation(["categoryRouter.create"], {
        onSuccess: () => {
            categoryQuery.refetch();
        }
    });
    const categoryUpdate = trpc.useMutation(["categoryRouter.update"], {
        onSuccess: () => {
            categoryQuery.refetch();
        }
    });
    const optionGroupMutation = trpc.useMutation(["optionGroupRouter.create"], {
        onSuccess: () => {
            optionGroupQuery.refetch();
        }
    });
    const optionGroupUpdate = trpc.useMutation(["optionGroupRouter.update"], {
        onSuccess: () => {
            optionGroupQuery.refetch();
        }
    });
    const categoryDelete = trpc.useMutation(["categoryRouter.delete"], {
        onSuccess: () => {
            categoryQuery.refetch();
        }
    });
    const optionGroupDelete = trpc.useMutation(["optionGroupRouter.delete"], {
        onSuccess: () => {
            optionGroupQuery.refetch();
        }
    });
    const productForm = useForm<{ name: string; description: string; price: number; }>();
    const optionForm = useForm<{ name: string; description: string; price?: number; maxAmount?: number }>();
    const form = useForm<{ name: string }>();
    const [enabled, setEnabled] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const buttonClass = 'flex w-full justify-between rounded-lg bg-wapi-light-blue px-4 py-2 text-left text-sm font-medium  hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75'
    const [selectedTab, setSelectedTab] = useState<'category' | 'optionGroup'>('category')
    const [selectedCategory, setSelectedCategory] = useState<{ id: string; name: string }>();
    const [selectedOptionGroup, setSelectedOptionGroup] = useState<{ id: string; name: string }>();
    const [isEdit, setIsEdit] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isProductDrawerOpen, setIsProductDrawerOpen] = useState(false);
    const [isOptionDrawerOpen, setIsOptionDrawerOpen] = useState(false);

    const toggleProductDrawer = () => {
        console.log('toggle');
        setIsProductDrawerOpen(!isProductDrawerOpen)
    };

    const toggleOptionDrawer = () => {
        setIsOptionDrawerOpen(!isOptionDrawerOpen)
    };

    const toggleModal = () => {
        if (isModalOpen) form.reset({ name: '' });
        setIsModalOpen(!isModalOpen);
    }

    const toggleDeleteModal = () => {
        setIsDeleteModalOpen(!isDeleteModalOpen);
    }

    const onSubmitCategoryForm: SubmitHandler<{ name: string }> = async ({ name }) => {
        if (isEdit) {
            if (selectedCategory) {
                categoryUpdate.mutate({ name, categoryId: selectedCategory.id })
                setSelectedCategory({ ...selectedCategory, name })
            }
            toggleModal()
            return;
        }
        if (userQuery.data?.venue?.menus[0]?.id) {
            categoryMutation.mutate({ name, menuId: userQuery.data.venue.menus[0].id })
        }
        toggleModal()
    }

    const onSubmitOptionGroupForm: SubmitHandler<{ name: string }> = async ({ name }) => {
        if (isEdit) {
            if (selectedOptionGroup) {
                optionGroupUpdate.mutate({ name, optionGroupId: selectedOptionGroup.id })
                setSelectedOptionGroup({ ...selectedOptionGroup, name })
            }
            toggleModal()
            return;
        }
        if (userQuery.data?.venue?.menus[0]?.id) {
            optionGroupMutation.mutate({ name, menuId: userQuery.data.venue.menus[0].id })
        }
        toggleModal()
    }

    const onChangeSwitch = (enabled: boolean) => {
        setEnabled(enabled)
        if (selectedCategory) categoryUpdate.mutate({ enabled, categoryId: selectedCategory.id })
        else if (selectedOptionGroup) optionGroupUpdate.mutate({ enabled, optionGroupId: selectedOptionGroup.id })
    }

    const handleOnClickEdit = () => {
        setIsEdit(true)
        form.setValue('name', selectedCategory?.name ? selectedCategory?.name : selectedOptionGroup?.name ? selectedOptionGroup?.name : '');
        toggleModal();
    }

    const handleOnClickDelete = async () => {
        if (selectedCategory) {
            categoryDelete.mutate({ categoryId: selectedCategory.id })
            toggleDeleteModal();
            setSelectedCategory(undefined);
        } else if (selectedOptionGroup) {
            optionGroupDelete.mutate({ optionGroupId: selectedOptionGroup.id })
            toggleDeleteModal();
            setSelectedOptionGroup(undefined);
        }
    }

    const parseName = (name: 'category' | 'optionGroup') => {
        return name === 'category' ? 'Categoría' : 'Grupo de opción';
    }

    const parseModalTitle = () => {
        return isEdit ? 'Editar' : 'Crear';
    }

    return (
        <>
            <Head>
                <title>Waip - Catálogo</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={'flex'}>
                <div className="h-96 rounded-lg border-4 border-dashed border-gray-200 basis-1/4">
                    <div className="w-full">
                        <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-2">
                            <div className="my-3">
                                <button
                                    onClick={toggleModal}
                                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-wapi-blue hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                >
                                    Crear {parseName(selectedTab)}
                                </button>
                            </div>
                            <Disclosure>
                                {({ open }) => (
                                    <>
                                        <Disclosure.Button
                                            className={buttonClass}
                                            onClick={() => {
                                                setSelectedTab('category')
                                            }}>
                                            <span>Categorías</span>
                                            <ChevronUpIcon
                                                className={`${open ? 'rotate-180 transform' : ''
                                                    } h-5 w-5 text-purple-500`}
                                            />
                                        </Disclosure.Button>
                                        {
                                            categoryQuery?.data?.map(({ id, name }) => {
                                                return (
                                                    <Disclosure.Panel
                                                        onClick={() => {
                                                            setIsEdit(false)
                                                            setSelectedOptionGroup(undefined)
                                                            setSelectedCategory({ id, name })
                                                        }}
                                                        key={id}
                                                        className="px-4 pt-4 pb-2 text-sm text-gray-500 cursor-pointer hover:bg-wapi-blue hover:text-white">
                                                        {name}
                                                    </Disclosure.Panel>
                                                )
                                            })
                                        }
                                    </>
                                )}
                            </Disclosure>
                            <Disclosure as="div" className="mt-2">
                                {({ open }) => (
                                    <>
                                        <Disclosure.Button
                                            className={buttonClass}
                                            onClick={() => {
                                                setSelectedTab('optionGroup')
                                            }}>
                                            <span>Grupo de Opciónes</span>
                                            <ChevronUpIcon
                                                className={`${open ? 'rotate-180 transform' : ''
                                                    } h-5 w-5 text-purple-500`}
                                            />
                                        </Disclosure.Button>
                                        {
                                            optionGroupQuery?.data?.map(({ id, name }) => {
                                                return (
                                                    <Disclosure.Panel
                                                        onClick={() => {
                                                            setIsEdit(false)
                                                            setSelectedOptionGroup({ id, name })
                                                            setSelectedCategory(undefined)
                                                        }}
                                                        key={id}
                                                        className="px-4 pt-4 pb-2 text-sm text-gray-500 cursor-pointer hover:bg-wapi-blue hover:text-white">
                                                        {name}
                                                    </Disclosure.Panel>
                                                )
                                            })
                                        }
                                    </>
                                )}
                            </Disclosure>
                        </div>
                    </div>
                </div>
                <div className="rounded-lg border-4 border-dashed border-gray-200 basis-3/4">
                    <div className="flex p-4 items-center">
                        <div className={'flex basis-2/4 justify-start gap-x-4 items-center'}>
                            <div className="basis-1/3">
                                <h4>{selectedCategory?.name ? selectedCategory.name : selectedOptionGroup?.name}</h4>
                            </div>
                            <div>
                                <button
                                    disabled={(selectedCategory || selectedOptionGroup) ? false : true}
                                    onClick={selectedCategory ? toggleProductDrawer : selectedOptionGroup ? toggleOptionDrawer : () => ({})}
                                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-wapi-blue hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                >
                                    Crear {selectedCategory?.name ? selectedCategory?.name : selectedOptionGroup?.name}
                                </button>
                            </div>
                        </div>
                        <div className={'flex basis-2/4 justify-end gap-x-4 items-center'}>
                            <div>
                                <button onClick={handleOnClickEdit} disabled={(selectedCategory || selectedOptionGroup) ? false : true}>
                                    <PencilIcon className="h-5 w-5 disabled:bg-gray-300 " />
                                </button>
                            </div>
                            <div>
                                <button onClick={toggleDeleteModal} disabled={(selectedCategory || selectedOptionGroup) ? false : true} >
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </div>
                            <Switch
                                checked={enabled}
                                onChange={onChangeSwitch}
                                className={`${enabled ? 'bg-blue-600' : 'bg-gray-200'
                                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                            >
                                <span
                                    className={`${enabled ? 'translate-x-6' : 'translate-x-1'
                                        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                />
                            </Switch>
                        </div>
                    </div>
                    {/* Items Table */}
                    <div>
                        <Table isCategoryOrOptionGroup={selectedCategory ? selectedCategory : selectedOptionGroup} columns={productColumns} />
                    </div>
                </div>
                {/** Modals */}
                {/* Create and Edit Modal*/}
                <Modal title={`${parseModalTitle()} ${parseName(selectedTab)}`} isOpen={isModalOpen} onClose={toggleModal}>
                    <Form form={form} onSubmitForm={selectedTab === 'category' ? onSubmitCategoryForm : onSubmitOptionGroupForm}>
                        <label htmlFor="street-address" className="block text-sm font-medium text-gray-700">
                            Nombre
                        </label>
                        <input
                            {...form.register('name')}
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        <div className="flex justify-end mt-2">
                            <Button type={'submit'}>{parseModalTitle()} {selectedTab === 'category' ? 'Categoría' : 'Grupo de opción'}</Button>
                        </div>
                    </Form>
                </Modal>
                {/* Delete Modal*/}
                <Modal
                    title={`¿Estas seguro que desea eliminar ${selectedCategory ? selectedCategory.name : selectedOptionGroup?.name}?`}
                    isOpen={isDeleteModalOpen}
                    onClose={toggleDeleteModal}
                >
                    <div className="flex justify-around mt-6">
                        <button className="py-2 px-4 bg-black text-white rounded-md" onClick={toggleDeleteModal}>Cancelar</button>
                        <button className="py-2 px-4 bg-red-500 text-white rounded-md" onClick={handleOnClickDelete}>Eliminar</button>
                    </div>
                </Modal>
                {/** Drawers */}
                {/* Product Drawer */}
                <Drawer title={'Crear producto'} isOpen={isProductDrawerOpen} toggleDrawer={toggleProductDrawer}>
                    <Form form={productForm} onSubmitForm={selectedTab === 'category' ? onSubmitCategoryForm : onSubmitOptionGroupForm}>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Nombre
                        </label>
                        <input
                            {...productForm.register('name')}
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Descripción
                        </label>
                        <input
                            {...productForm.register('description')}
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                            Precio
                        </label>
                        <input
                            {...productForm.register('price')}
                            type="number"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        <div className="flex justify-end mt-2">
                            <Button type={'submit'}>{parseModalTitle()} {selectedTab === 'category' ? 'Categoría' : 'Grupo de opción'}</Button>
                        </div>
                    </Form>
                </Drawer>
                {/* Option Drawer */}
                <Drawer title={'Crear opción'} isOpen={isOptionDrawerOpen} toggleDrawer={toggleOptionDrawer}>
                    <Form form={optionForm} onSubmitForm={selectedTab === 'category' ? onSubmitCategoryForm : onSubmitOptionGroupForm}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Nombre
                            </label>
                            <input
                                {...optionForm.register('name')}
                                type="text"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="mt-3">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Descripción
                            </label>
                            <input
                                {...optionForm.register('description')}
                                type="text"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="mt-3">
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                Precio
                            </label>
                            <input
                                {...optionForm.register('price')}
                                type="number"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="mt-3">
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                Máximo seleccionable
                            </label>
                            <input
                                {...optionForm.register('maxAmount')}
                                type="number"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="flex justify-end mt-3">
                            <Button type={'submit'}>Crear opción</Button>
                        </div>
                    </Form>
                </Drawer>
            </div>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const session = await getServerAuthSession(ctx);

    if (!session) {
        return {
            redirect: { destination: "/api/auth/signin", permanent: false },
        }
    }

    return {
        props: session
    }
}

export default Catalog;