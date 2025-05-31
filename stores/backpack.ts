import { defineStore } from 'pinia';


export interface Item {
    name: string;
    id: string;
    src: string;
    description: string;
}



export const useBackpacktStore = defineStore('backpack', {
    state: () => ({
        properties: [] as Item[],
    }),
    getters: {
        getItems: (state) => {
            return state.properties
        },
    },
    actions: {
        addItem(item: Item) {
            const i = this.$state.properties.findIndex((x: Item) => x.id === item.id)
            if (i > -1) {
                console.warn(`Item with id ${item.id} already exists in the cart.`)
            } else {
                this.$state.properties.push(item)
            }
        },

        removeItem(item: Item) {
            const i = this.$state.properties.findIndex((x: Item) => x.name === item.name)
            if (i > -1) {
                this.$state.properties.splice(i, 1)
            }
        },
        /**
         * 檢查背包是否擁有所有指定 id 的物品
         */
        hasRequiredItems(requireItems?: string[]): boolean {
            if (!requireItems || requireItems.length === 0) return true;
            return requireItems.every((id) =>
                this.$state.properties.some((item: Item) => item.id === id)
            );
        },
        /**
         * 回傳缺少的物品名稱陣列（僅回傳 id，名稱需外部處理）
         */
        getMissingItemIds(requireItems?: string[]): string[] {
            if (!requireItems || requireItems.length === 0) return [];
            return requireItems.filter((id) =>
                !this.$state.properties.some((item: Item) => item.id === id)
            );
        },
    },
})