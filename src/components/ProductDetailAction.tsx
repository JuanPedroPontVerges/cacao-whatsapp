import { DisplayType, Option } from "@prisma/client"
import { UseFormReturn } from "react-hook-form";

type OptionGroupAction = {
    options: Option[];
    id: string;
    name: string;
}

export type ProductDetailActionProps = {
    displayType: DisplayType;
    optionGroup: OptionGroupAction;
    amount: number;
    name: string;
    multipleUnits?: boolean;
    form: UseFormReturn;
}

const ProductDetailAction: React.FC<ProductDetailActionProps> = ({ displayType, multipleUnits, optionGroup, amount, name, form }) => {
    const conditionallyRenderInput = (displayType: DisplayType, amount: number, multipleUnits?: boolean) => {
        if (displayType.name.includes('Fija')) {
            if (amount > 1 && multipleUnits) {
                return 'checkbox and multiple units!'
            } else if (amount > 1 && !multipleUnits) {
                return 'checkbox!'
            } else if (displayType.name.includes('Fija') && amount == 1) {
                return 'radio!'
            }
        } else {
            if (!multipleUnits) {
                return 'checkbox!'
            } else {
                return 'checkbox and multiple units!'
            }
        }
    }

    const handleInputNumber = (add: boolean, name: string) => {
        const prevValue = Number(form.getValues(name)) || 0;
        if (add === true) {
            form.setValue(name, prevValue + 1)
        } else if (prevValue > 0) {
            form.setValue(name, prevValue - 1)
        }
    }

    return (
        <>
            {
                optionGroup.options.map((option, index) => {
                    return (
                        <div key={index}>
                            {conditionallyRenderInput(displayType, amount, multipleUnits) === 'radio!' ? (
                                <div className="flex justify-between items-center my-2">
                                    <div className="basis-3/4 flex gap-x-4 items-center">
                                        <input
                                            value={option.id}
                                            {...form.register(`${name}.option`)}
                                            type="radio"
                                            className="h-6 w-6 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <div className="flex flex-col">
                                            <label className="block text-lg font-medium text-gray-700">
                                                {option.name}
                                            </label>
                                            <span>{option.description}</span>
                                        </div>
                                    </div>
                                    {option.price ? (<div>${option.price}</div>) : null}
                                </div>
                            ) : conditionallyRenderInput(displayType, amount, multipleUnits) === 'checkbox!' ? (
                                <div className="flex justify-between items-center my-2">
                                    <div className="flex items-center basis-3/4 gap-x-4">
                                        <input
                                            {...form.register(`${name}.option.${option.id}`)}
                                            type="checkbox"
                                            className="h-6 w-6 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <div className="flex flex-col">
                                            <label className="block text-lg font-medium text-gray-700">
                                                {option.name}
                                            </label>
                                            <span>{option.description}</span>
                                        </div>
                                    </div>
                                    {option.price ? (<div>${option.price}</div>) : null}
                                </div>
                            ) : conditionallyRenderInput(displayType, amount, multipleUnits) === 'checkbox and multiple units!' ? (
                                <div className="flex justify-between items-center my-2">
                                    <div className="flex items-center basis-3/4 gap-x-4">
                                        <div className="flex flex-col">
                                            <label className="block text-lg font-medium text-gray-700">
                                                {option.name}
                                            </label>
                                            <span>{option.description}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-x-2">
                                        <button className="text-2xl p-1" onClick={() => handleInputNumber(false, `${name}.option.${option.id}.amount`)}>-</button>
                                        <input
                                            defaultValue={0}
                                            type="number"
                                            readOnly
                                            className="text-center w-10 h-6"
                                            {...form.register(`${name}.option.${option.id}.amount`, {
                                                valueAsNumber: true,
                                                min: 0,
                                                max: option.maxAmount || undefined,
                                            })}
                                        />
                                        <button className="text-2xl p-1" onClick={() => handleInputNumber(true, `${name}.option.${option.id}.amount`)}>+</button>
                                        {option.price ? (<div>${option.price}</div>) : null}
                                    </div>
                                </div>
                            ) : 'Ni idea wachin'}
                        </div>
                    )
                })
            }

        </>
    )
};
export default ProductDetailAction;