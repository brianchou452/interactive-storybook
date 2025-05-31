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
            const i = this.properties.findIndex((x) => x.id === item.id)
            if (i > -1) {
                console.warn(`Item with id ${item.id} already exists in the cart.`)
            } else {
                this.properties.push(item)
            }
        },

        removeItem(item: Item) {
            const i = this.properties.findIndex((x) => x.name === item.name)
            if (i > -1) {
                this.properties.splice(i, 1)
            }
        },
    },
})