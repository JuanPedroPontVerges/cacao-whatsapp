import { DisplayType, Option } from "@prisma/client"
import { UseFormReturn } from "react-hook-form";

type OptionGroupAction = {
    option: Option;
}

export type ProductDetailActionProps = {
    displayType: DisplayType;
    productOptions: OptionGroupAction[];
    amount: number;
    name: string;
    disabled: boolean;
    multipleUnits?: boolean;
    form: UseFormReturn;
    handleSetPrice: (price: number) => void;
}
/*
    TODO
    [] - See how i can prevent user selecting multiple units in options that doesnt have multipleUnits configs. 
*/
const ProductDetailAction: React.FC<ProductDetailActionProps> = ({ displayType, multipleUnits, productOptions, amount, name, form, disabled, handleSetPrice }) => {
    const handleInputNumber = (add: boolean, inputAmountName: string, price: number | null) => {
        const isLimitedOptionGroup = displayType.name.includes('Cantidad Fija');
        if (isLimitedOptionGroup) {
            let counter = 0;
            const optionGroupWatcher = form.watch(`${name}`)
            for (const option in optionGroupWatcher.option) {
                counter += optionGroupWatcher.option[option].amount;
            }
            if (counter + 1 > amount && add === true) {
                alert('Llegaste al limite')
                return;
            }
        }
        const prevValue = Number(form.getValues(inputAmountName)) || 0;
        if (price && add === true) {
            handleSetPrice(Number(price));
        } else if (price && add === false && prevValue != 0) {
            handleSetPrice(-Math.abs(price))
        }
        if (add === true) {
            form.setValue(inputAmountName, prevValue + 1)
        } else if (prevValue > 0) {
            form.setValue(inputAmountName, prevValue - 1)
        }
    }

    return (
        <>
            {
                productOptions.map(({ option }, index) => {
                    return (
                        <div key={index}>
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
                                    <button className="text-2xl p-1" onClick={() => handleInputNumber(false, `${name}.option.${option.id}.amount`, option.price)}>-</button>
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
                                    <button className="text-2xl p-1 disabled:text-red-300" disabled={disabled} onClick={() => handleInputNumber(true, `${name}.option.${option.id}.amount`, option.price)}>+</button>
                                    {option.price ? (<div>${option.price}</div>) : null}
                                </div>
                            </div>
                        </div>
                    )
                })
            }

        </>
    )
};
export default ProductDetailAction;