import { getCategories, getSubCategories } from "@/lib/data";
import CollectionContent from "./CollectionContent";
import { Suspense } from "react";

export const metadata = {
    title: "Collection | FootLoft",
    description: "Browse our latest collection of footwear.",
};

export default async function Collection() {
    const [categories, subCategories] = await Promise.all([
        getCategories(),
        getSubCategories(),
    ]);

    return (
        <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
            <CollectionContent
                initialCategories={categories}
                initialSubCategories={subCategories}
            />
        </Suspense>
    );
}
