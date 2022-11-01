import { NextPageWithLayout } from "../_app";
import StoreNav from "../../components/layouts/StoreNav";


const Index: NextPageWithLayout = (props) => {
    return (
        <>
            Hi im index
        </>
    )
}

Index.getLayout = function getLayout(page) {
    return (
        <StoreNav>
            {page}
        </StoreNav>
    )
}

export default Index;