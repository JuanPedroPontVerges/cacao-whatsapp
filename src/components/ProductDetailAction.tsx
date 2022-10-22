import { DisplayType, Option } from "@prisma/client"

type OptionGroupAction = {
    options: Option[];
    id: string;
    name: string;
}

export type ProductDetailActionProps = {
    displayType: DisplayType;
    optionGroup: OptionGroupAction;
    multipleUnits?: boolean;
    amount: number;
}

const ProductDetailAction: React.FC<ProductDetailActionProps> = ({ displayType, multipleUnits, optionGroup, amount }) => {
    const conditionallyRenderInput = (displayType: DisplayType,  amount: number, multipleUnits?: boolean) => {
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
                return 'checkbox and multiple units'
            }
        }
    }

    return (
        <>
            {conditionallyRenderInput(displayType, amount, multipleUnits)}
        </>
    )
};
export default ProductDetailAction;