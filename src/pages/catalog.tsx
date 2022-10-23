import { Disclosure, Switch } from "@headlessui/react";
import { ChevronUpIcon, TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../components/Button";
import Drawer from "../components/Drawer";
import Form from "../components/Form";
import Modal from "../components/Modal";
import { trpc } from "../utils/trpc";
import {
    ColumnDef,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import Table from "../components/Table";
import Upload from "../components/Upload";
import List from "../components/List";
import Dashboard from "../components/layouts/Dashboard";
import { NextPageWithLayout } from "./_app";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "../server/common/get-server-auth-session";
type Option = {
    id: string;
    name: string;
    enabled: boolean;
    description: string | null;
    price: number | null;
    maxAmount?: number | null;
}

type Product = {
    id: string;
    name: string;
    enabled: boolean;
    description: string | null;
    price: number | null;
}

type OptionFormInput = {
    name: string;
    description: string;
    price?: number;
    maxAmount?: number
}

type ProductFormInput = {
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
    optionGroups: Record<string, {
        displayTypeId: string;
        enabled: boolean;
        maxAmount: number;
        multipleUnits: boolean;
        options: Record<string, boolean>
    }>
}

const Catalog: NextPageWithLayout = () => {
    const { data } = useSession();
    /* Queries */
    const userQuery = trpc.useQuery(["userRouter.getVenues", { id: data?.user?.id }]);
    const categoryQuery = trpc.useQuery(["categoryRouter.findCategoriesByMenuId", { id: userQuery.data?.venue?.menus[0]?.id }])
    const optionGroupQuery = trpc.useQuery(["optionGroupRouter.findOptionGroupsByMenuId", { id: userQuery.data?.venue?.menus[0]?.id }])
    const displayTypeQuery = trpc.useQuery(["displayTypeRouter.get"])
    /* Creations */
    const categoryMutation = trpc.useMutation(["categoryRouter.create"], {
        onSuccess: () => {
            categoryQuery.refetch();
        }
    });
    const optionGroupMutation = trpc.useMutation(["optionGroupRouter.create"], {
        onSuccess: () => {
            optionGroupQuery.refetch();
        }
    });
    const optionMutation = trpc.useMutation(["optionRouter.create"], {
        onSuccess: () => {
            optionQuery.refetch();
        }
    })
    const productMutation = trpc.useMutation(["productRouter.create"], {
        onSuccess: () => {
            productQuery.refetch();
        }
    })
    const productStoreToOptionGroupMutation = trpc.useMutation(["productStoreToOptionGroupRouter.create"])
    const productOptionMutation = trpc.useMutation(["productOptionRouter.create"])
    /* Updates */
    const categoryUpdate = trpc.useMutation(["categoryRouter.update"], {
        onSuccess: () => {
            categoryQuery.refetch();
        }
    });
    const optionGroupUpdate = trpc.useMutation(["optionGroupRouter.update"], {
        onSuccess: () => {
            optionGroupQuery.refetch();
        }
    });
    /* Indexes */
    const optionUpdateIndexes = trpc.useMutation(["optionRouter.indexes"]);
    const productUpdateIndexes = trpc.useMutation(["productRouter.indexes"]);

    const optionUpdate = trpc.useMutation(["optionRouter.update"], {
        onSuccess: () => {
            optionQuery.refetch();
        }
    });

    const productUpdate = trpc.useMutation(["productRouter.update"], {
        onSuccess: () => {
            optionQuery.refetch();
        }
    });
    /* Deletes */
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
    const optionDelete = trpc.useMutation(["optionRouter.delete"], {
        onSuccess: () => {
            optionQuery.refetch();
        }
    });
    const productDelete = trpc.useMutation(["productRouter.delete"], {
        onSuccess: () => {
            productQuery.refetch();
        }
    });
    const optionDefaultColumns: ColumnDef<Option>[] = [
        {
            accessorKey: 'name',
            cell: info => info.getValue(),
        },
        {
            accessorFn: row => row.description,
            id: 'description',
            cell: info => info.getValue(),
            header: () => <span>description</span>,
        },
        {
            header: 'Precio',
            accessorKey: 'price',
        },
        {
            header: 'Acciones',
            id: 'actions',
            accessorFn: ((record) => {
                return (
                    <div className="flex gap-x-4 align-middle">
                        <button onClick={() => {
                            toggleOptionDrawer(record)
                        }}>
                            <PencilIcon className="h-5 w-5" />
                        </button>
                        <button onClick={() => {
                            handleOnClickDeleteOption(record)
                        }}>
                            <TrashIcon className="h-5 w-5" />
                        </button>
                        <Switch
                            checked={record.enabled}
                            onChange={(input: boolean) => {
                                onChangeOptionSwitch(input, record.id);
                            }}
                            className={`${record.enabled ? 'bg-blue-600' : 'bg-gray-200'
                                } relative inline-flex h-6 w-11 items-center rounded-full`}
                        >
                            <span
                                className={`${record.enabled ? 'translate-x-6' : 'translate-x-1'
                                    } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                            />
                        </Switch>
                    </div>
                )
            }),
            cell: (value) => value.renderValue(),
        },
    ]
    const productDefaultColumns: ColumnDef<Product>[] = [
        {
            accessorKey: 'name',
            cell: info => info.getValue(),
        },
        {
            accessorFn: row => row.description,
            id: 'description',
            cell: info => info.getValue(),
            header: () => <span>description</span>,
        },
        {
            header: 'Precio',
            accessorKey: 'price',
        },
        {
            header: 'Acciones',
            id: 'actions',
            accessorFn: ((record) => {
                return (
                    <div className="flex gap-x-4 align-middle">
                        <button onClick={() => {
                            toggleProductDrawer(record)
                        }}>
                            <PencilIcon className="h-5 w-5" />
                        </button>
                        <button onClick={() => {
                            handleOnClickDeleteProduct(record)
                        }}>
                            <TrashIcon className="h-5 w-5" />
                        </button>
                        <Switch
                            checked={record.enabled}
                            onChange={(input: boolean) => {
                                onChangeProductSwitch(input, record.id);
                            }}
                            className={`${record.enabled ? 'bg-blue-600' : 'bg-gray-200'
                                } relative inline-flex h-6 w-11 items-center rounded-full`}
                        >
                            <span
                                className={`${record.enabled ? 'translate-x-6' : 'translate-x-1'
                                    } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                            />
                        </Switch>
                    </div>
                )
            }),
            cell: (value) => value.renderValue(),
        },
    ]
    const [selectedOptionGroup, setSelectedOptionGroup] = useState<{ id: string; name: string; enabled: boolean }>();
    const [selectedCategory, setSelectedCategory] = useState<{ id: string; name: string; enabled: boolean }>();
    const productQuery = trpc.useQuery(["productRouter.findByCategoryId", { id: selectedCategory?.id }])
    const optionQuery = trpc.useQuery(["optionRouter.findOptionsByOptionGroupId", { id: selectedOptionGroup?.id }])
    const productForm = useForm<ProductFormInput>();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const optionGroupsWatcher = productForm.watch(optionGroupQuery.data?.map(({ id }) => (`optionGroups.${id}.enabled`) as any) || [])
    const displayTypeWatcher: any = productForm.watch(`optionGroups` || [])
    const optionForm = useForm<OptionFormInput>();
    const form = useForm<{ name: string }>();
    const [products, setProducts] = React.useState(() => productQuery.data ? [...productQuery.data] : [])
    const [options, setOptions] = React.useState(() => optionQuery.data ? [...optionQuery.data] : [])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const buttonClass = 'flex w-full justify-between rounded-lg bg-wapi-light-blue px-4 py-2 text-left text-sm font-medium  hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75'
    const [selectedTab, setSelectedTab] = useState<'category' | 'optionGroup'>('category')
    const [isEdit, setIsEdit] = useState(false);
    const [selectedOption, setSelectedOption] = useState<{ isEdit: boolean; option?: Option }>({ isEdit: false, option: undefined });
    const [selectedProduct, setSelectedProduct] = useState<{ isEdit: boolean; product?: Product }>({ isEdit: false, product: undefined });
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isOptionDeleteModalOpen, setIsOptionDeleteModalOpen] = useState(false);
    const [isProductDeleteModalOpen, setIsProductDeleteModalOpen] = useState(false);
    const [isProductDrawerOpen, setIsProductDrawerOpen] = useState(false);
    const [isOptionDrawerOpen, setIsOptionDrawerOpen] = useState(false);
    const [optionColumns] = React.useState(() => [...optionDefaultColumns])
    const [productColumns] = React.useState(() => [...productDefaultColumns])
    const fixedAmountDisplayTypeId = displayTypeQuery?.data?.find((displayType) => displayType.name == 'Cantidad Fija')?.id
    const isEnabled = selectedCategory ? selectedCategory.enabled : selectedOptionGroup ? selectedOptionGroup.enabled : false;
    const optionsTable = useReactTable({
        data: options,
        columns: optionColumns,
        getRowId: row => row.id,
        getCoreRowModel: getCoreRowModel(),
    })
    const productsTable = useReactTable({
        data: products,
        columns: productColumns,
        getRowId: row => row.id,
        getCoreRowModel: getCoreRowModel(),
    })
    useEffect(() => {
        if (optionQuery.data) {
            setOptions(optionQuery.data);
        }
    }, [optionQuery.data])

    useEffect(() => {
        if (productQuery.data) {
            setProducts(productQuery.data);
        }
    }, [productQuery.data])

    if (categoryQuery.isLoading || optionGroupQuery.isLoading || displayTypeQuery.isLoading) return (<>Loading...</>)
    else if (categoryQuery.error || optionGroupQuery.error || displayTypeQuery.error) return (<>Error!</>)

    const reorderOptionsRow = (draggedRowIndex: number, targetRowIndex: number) => {
        if (options) {
            options.splice(targetRowIndex, 0, options.splice(draggedRowIndex, 1)[0] as any)
            setOptions(() => {
                const ids = options.map(({ id }) => { return id })
                optionUpdateIndexes.mutate(ids);
                return [...options];
            })
        }
    }
    const reorderProductsRow = (draggedRowIndex: number, targetRowIndex: number) => {
        if (products) {
            products.splice(targetRowIndex, 0, products.splice(draggedRowIndex, 1)[0] as any)
            setProducts(() => {
                const ids = products.map(({ id }) => { return id })
                productUpdateIndexes.mutate(ids);
                return [...products];
            })
        }
    }

    function onChangeOptionSwitch(enabled: boolean, optionId: string) {
        optionUpdate.mutate({ optionId, enabled });
    }

    function onChangeProductSwitch(enabled: boolean, productId: string) {
        productUpdate.mutate({ productId, enabled });
    }

    async function toggleProductDrawer(product?: Product) {
        if (isProductDrawerOpen) {
            productForm.resetField('name')
            productForm.resetField('description')
            productForm.resetField('price')
            productForm.resetField('optionGroups')
            setSelectedProduct({ isEdit: false, product: undefined })
        }
        if (product) {
            const { data } = await productQuery.refetch()
            console.log('data', data);
            const foundProduct = data?.find((p) => p.id == product.id);
            if (foundProduct?.productStore?.productStoreToOptionGroups) {
                for (const productStoreToOptionGroups of foundProduct?.productStore?.productStoreToOptionGroups) {
                    productForm.setValue(`optionGroups.${productStoreToOptionGroups.optionGroupId}.displayTypeId`, productStoreToOptionGroups.displayTypeId);
                    productForm.setValue(`optionGroups.${productStoreToOptionGroups.optionGroupId}.maxAmount`, productStoreToOptionGroups.amount || 0);
                    productForm.setValue(`optionGroups.${productStoreToOptionGroups.optionGroupId}.multipleUnits`, productStoreToOptionGroups.multipleUnits);
                    productForm.setValue(`optionGroups.${productStoreToOptionGroups.optionGroupId}.enabled`, productStoreToOptionGroups.enabled);
                    for (const option of productStoreToOptionGroups.productOptions) {
                        productForm.setValue(`optionGroups.${productStoreToOptionGroups.optionGroupId}.options.${option.optionId}`, option.enabled)
                    }
                }
            }
            setSelectedProduct({ isEdit: true, product });
            const { name, description, price } = product;
            productForm.setValue('name', name)
            productForm.setValue('description', description ?? '')
            productForm.setValue('price', price ?? 0)
        }
        setIsProductDrawerOpen(!isProductDrawerOpen)
    }

    function toggleOptionDrawer(option?: Option) {
        if (isOptionDrawerOpen) {
            optionForm.resetField('name')
            optionForm.resetField('description')
            optionForm.resetField('price')
            optionForm.resetField('maxAmount')
            setSelectedOption({ isEdit: false, option: undefined })
        }
        if (option) {
            setSelectedOption({ isEdit: true, option });
            const { name, description, maxAmount, price } = option;
            optionForm.setValue('name', name)
            optionForm.setValue('description', description ?? '')
            optionForm.setValue('price', price ?? 0)
            optionForm.setValue('maxAmount', maxAmount ?? 0)
        }
        setIsOptionDrawerOpen(!isOptionDrawerOpen)
    }

    const toggleModal = () => {
        if (isModalOpen) {
            setIsEdit(false)
            form.reset({ name: '' })

        }
        setIsModalOpen(!isModalOpen);
    }

    const toggleDeleteModal = () => {
        setIsDeleteModalOpen(!isDeleteModalOpen);
    }

    function toggleOptionDeleteModal() {
        setIsOptionDeleteModalOpen(!isOptionDeleteModalOpen);
    }

    function toggleProductDeleteModal() {
        setIsProductDeleteModalOpen(!isProductDeleteModalOpen);
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

    const onSubmitProductForm: SubmitHandler<ProductFormInput> = async (input) => {
        console.log('input', input);
        const { name, description, price, optionGroups, imageUrl } = input
        if (selectedCategory) {
            productMutation.mutate({ name, description, price, imageUrl, index: productQuery.data?.length || 1, categoryId: selectedCategory.id }, {
                onSuccess: async ({ productStore }) => {
                    if (productStore) {
                        for (const optionGroupId in optionGroups) {
                            if (optionGroupId) {
                                const productStoreToOptionGroup = optionGroups[optionGroupId]
                                if (productStoreToOptionGroup) {
                                    const { id: productStoreToOptionGroupId } = await productStoreToOptionGroupMutation.mutateAsync({
                                        optionGroupId,
                                        productStoreId: productStore.id,
                                        displayTypeId: productStoreToOptionGroup?.displayTypeId,
                                        amount: productStoreToOptionGroup.maxAmount,
                                        enabled: productStoreToOptionGroup.enabled,
                                        multipleUnits: productStoreToOptionGroup.multipleUnits,
                                    })
                                    if (productStoreToOptionGroup.options) {
                                        for (const optionId in productStoreToOptionGroup.options) {
                                            const enabled = productStoreToOptionGroup.options[optionId]
                                            if (typeof enabled === 'boolean') {
                                                await productOptionMutation.mutateAsync({ productStoreToOptionGroupId, optionId, enabled })
                                            }

                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
        }
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

    const onSubmitOptionForm: SubmitHandler<OptionFormInput> = async (input) => {
        /* Update */
        const maxAmount = input.maxAmount ? input.maxAmount : 0;
        const price = input.price ? input.price : 0;
        if (selectedOption.isEdit && selectedOption.option) {
            const { id } = selectedOption.option
            optionUpdate.mutate({ ...input, maxAmount, price, optionId: id })
            toggleOptionDrawer()
            return;
        }
        /* Creation */
        if (selectedOptionGroup) {
            optionMutation.mutate({ ...input, maxAmount, price, optionGroupId: selectedOptionGroup.id });
            toggleOptionDrawer()
            return;
        }
    };

    const onChangeSwitch = (enabled: boolean) => {
        if (selectedCategory) {
            setSelectedCategory({ ...selectedCategory, enabled })
            categoryUpdate.mutate({ enabled, categoryId: selectedCategory.id })
        }
        else if (selectedOptionGroup) {
            setSelectedOptionGroup({ ...selectedOptionGroup, enabled })
            optionGroupUpdate.mutate({ enabled, optionGroupId: selectedOptionGroup.id })
        }
    }

    const handleOnClickEdit = () => {
        setIsEdit(true)
        form.setValue('name', selectedCategory?.name ? selectedCategory?.name : selectedOptionGroup?.name ? selectedOptionGroup?.name : '');
        toggleModal();
    }

    function handleOnClickDeleteOption(option: Option) {
        setSelectedOption({ isEdit: false, option })
        toggleOptionDeleteModal();
    }

    const onDeleteOption = () => {
        if (selectedOption.option && !selectedOption.isEdit) {
            const { id } = selectedOption.option;
            optionDelete.mutate({ optionId: id });
            setSelectedOption({ isEdit: false, option: undefined });
            toggleOptionDeleteModal();
        }
    }

    function handleOnClickDeleteProduct(product: Product) {
        setSelectedProduct({ isEdit: false, product })
        toggleProductDeleteModal();
    }

    const onDeleteProduct = () => {
        if (selectedProduct.product && !selectedProduct.isEdit) {
            const { id } = selectedProduct.product;
            productDelete.mutate({ productId: id });
            setSelectedProduct({ isEdit: false, product: undefined });
            toggleProductDeleteModal();
        }
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
                                            categoryQuery?.data?.map(({ id, name, enabled }) => {
                                                return (
                                                    <Disclosure.Panel
                                                        onClick={() => {
                                                            setIsEdit(false)
                                                            setSelectedOptionGroup(undefined)
                                                            setSelectedCategory({ id, name, enabled })
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
                                            optionGroupQuery?.data?.map(({ id, name, enabled }) => {
                                                return (
                                                    <Disclosure.Panel
                                                        onClick={() => {
                                                            setIsEdit(false)
                                                            setSelectedOptionGroup({ id, name, enabled })
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
                                    onClick={selectedCategory ? () => { toggleProductDrawer() } : selectedOptionGroup ? () => { toggleOptionDrawer() } : () => ({})}
                                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-wapi-blue hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                >
                                    Crear {selectedCategory?.name ? selectedCategory?.name : selectedOptionGroup?.name}
                                </button>
                            </div>
                        </div>
                        <div className={'flex basis-2/4 justify-end gap-x-4 items-center'}>
                            <div>
                                <button onClick={handleOnClickEdit} disabled={(selectedCategory || selectedOptionGroup) ? false : true}>
                                    <PencilIcon className="h-5 w-5 disabled:bg-gray-300" />
                                </button>
                            </div>
                            <div>
                                <button onClick={toggleDeleteModal} disabled={(selectedCategory || selectedOptionGroup) ? false : true} >
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </div>
                            <Switch
                                checked={isEnabled}
                                onChange={onChangeSwitch}
                                className={`${isEnabled ? 'bg-blue-600' : 'bg-gray-200'
                                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                            >
                                <span
                                    className={`${isEnabled ? 'translate-x-6' : 'translate-x-1'
                                        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                />
                            </Switch>
                        </div>
                    </div>
                    {/* Tables */}
                    {
                        selectedCategory ? (
                            <Table table={productsTable} reorderRow={reorderProductsRow} />
                        ) : (
                            <Table table={optionsTable} reorderRow={reorderOptionsRow} />
                        )
                    }
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
                <Modal
                    title={`¿Estas seguro que desea eliminar ${selectedOption.option?.name}?`}
                    isOpen={isOptionDeleteModalOpen}
                    onClose={toggleOptionDeleteModal}
                >
                    <div className="flex justify-around mt-6">
                        <button className="py-2 px-4 bg-black text-white rounded-md" onClick={toggleOptionDeleteModal}>Cancelar</button>
                        <button className="py-2 px-4 bg-red-500 text-white rounded-md" onClick={onDeleteOption}>Eliminar</button>
                    </div>
                </Modal>
                <Modal
                    title={`¿Estas seguro que desea eliminar ${selectedProduct.product?.name}?`}
                    isOpen={isProductDeleteModalOpen}
                    onClose={toggleProductDeleteModal}
                >
                    <div className="flex justify-around mt-6">
                        <button className="py-2 px-4 bg-black text-white rounded-md" onClick={toggleProductDeleteModal}>Cancelar</button>
                        <button className="py-2 px-4 bg-red-500 text-white rounded-md" onClick={onDeleteProduct}>Eliminar</button>
                    </div>
                </Modal>
                {/** Drawers */}
                {/* Product Drawer */}
                <Drawer title={'Crear producto'} isOpen={isProductDrawerOpen} toggleDrawer={toggleProductDrawer}>
                    <Form form={productForm} onSubmitForm={onSubmitProductForm}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Nombre
                            </label>
                            <input
                                {...productForm.register('name')}
                                type="text"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="mt-3">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Descripción
                            </label>
                            <input
                                {...productForm.register('description')}
                                type="text"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="mt-3">
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                Precio
                            </label>
                            <input
                                {...productForm.register('price', { valueAsNumber: true })}
                                type="number"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="mt-3">
                            <label className="block text-sm font-medium text-gray-700">
                                Grupo de opciones
                            </label>
                            <fieldset className="m-4">
                                {
                                    optionGroupQuery.data?.map(({ id, name, options }, index) => {
                                        return (
                                            <div className="mt-4 space-y-4 rounded-md border-2 border-dashed border-gray-300 p-4" key={index}>
                                                <div className="flex flex-col">
                                                    {
                                                        displayTypeQuery.data ? (
                                                            <List
                                                                name={`optionGroups.${id}.displayTypeId`}
                                                                form={productForm}
                                                                options={displayTypeQuery.data.map(({ id, name }) => ({ id, name }))}
                                                            />
                                                        ) : ('...Loading')
                                                    }
                                                </div>
                                                {
                                                    displayTypeWatcher?.[id]?.['displayTypeId'] == fixedAmountDisplayTypeId ? (
                                                        <div className="flex flex-col justify-start">
                                                            <label htmlFor="optionGroups" className="text-sm font-medium text-gray-700">
                                                                Cantidad
                                                            </label>
                                                            <input
                                                                {...productForm.register(`optionGroups.${id}.maxAmount`, { valueAsNumber: true, min: 0 })}
                                                                type="number"
                                                                className="mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                            />
                                                        </div>
                                                    ) : null
                                                }
                                                <div className="flex items-center gap-x-3">
                                                    <label htmlFor={`optionGroups.${id}.multipleUnits`} className="text-sm font-medium text-gray-700">
                                                        Múltiples unidades por item
                                                    </label>
                                                    <input
                                                        {...productForm.register(`optionGroups.${id}.multipleUnits`)}
                                                        type="checkbox"
                                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mt-2"
                                                    />
                                                </div>

                                                <div className="flex items-start">
                                                    <div className="flex items-center h-6">
                                                        <input
                                                            {...productForm.register(`optionGroups.${id}.enabled`)}
                                                            type="checkbox"
                                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                        />
                                                    </div>
                                                    <div className="ml-3 text-sm min-h-6">
                                                        <label htmlFor="comments" className="font-medium text-gray-700">
                                                            {name}
                                                        </label>
                                                        <p className="text-gray-500">Items: {options.length}</p>
                                                        <div className='m-2 flex items-start'>
                                                            {optionGroupsWatcher[index] ? (
                                                                <div className="flex flex-col gap-y-2">
                                                                    {options.map((option) => {
                                                                        return (
                                                                            <div key={option.id} className='flex align-middle gap-2'>
                                                                                <input
                                                                                    {...productForm.register(`optionGroups.${id}.options.${option.id}`)}
                                                                                    type="checkbox"
                                                                                    className="rounded border-gray-300 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                                                                />
                                                                                <label htmlFor="comments" className="font-medium text-gray-700">
                                                                                    {option.name}
                                                                                </label>
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </fieldset>
                        </div>
                        <div className={'my-3'}>
                            <Upload label={'Foto'} form={productForm} />
                        </div>
                        <div className="flex justify-end my-4">
                            <Button type={'submit'}>Crear producto</Button>
                        </div>
                    </Form>
                </Drawer>
                {/* Option Drawer */}
                <Drawer title={`Crear opción`} isOpen={isOptionDrawerOpen} toggleDrawer={toggleOptionDrawer}>
                    <Form form={optionForm} onSubmitForm={onSubmitOptionForm}>
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
                                {...optionForm.register('price', { valueAsNumber: true })}
                                type="number"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="mt-3">
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                Máximo seleccionable
                            </label>
                            <input
                                {...optionForm.register('maxAmount', { valueAsNumber: true, min: 0 })}
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


Catalog.getLayout = function getLayout(page: any) {
    return (
        <Dashboard>
            {page}
        </Dashboard>
    )
}

export default Catalog;