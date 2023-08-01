<script setup lang="ts" generic="T extends any">
import { Ref, ref } from 'vue';
import SVGIcon from '../components/SVGIcon.vue';
import vDrag from '../vue-dnd/drag';
import vDrop from '../vue-dnd/drop';

const props = defineProps<{
	items: T[],
	emptyItem: T,
	edit: boolean
}>();
const listEl = ref<HTMLDivElement>();
const list = ref(props.items) as Ref<T[]>;
function arrayMove(arr: Array<any>, old_index: number, new_index: number) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
};
const onDrag = (dropzone: Element, el: Element) => {
	const currentList = [...listEl.value!.children];
	arrayMove(
		list.value,
		currentList.indexOf(el.closest('.item-line')!),
		currentList.indexOf(dropzone)!);
	setTimeout(() => dropzone.classList.remove('dragover'), 200);
}
</script>

<template>
	<div ref="listEl" class="list" :class="edit ? 'edit' : ''">
		<div class="item-line"
			v-for="item, i in list"
			v-drop="{ channel: 'list' }">
			<template v-if="edit">
				<button class="add-button" @click="() => list.splice(i, 0, emptyItem as T)">
					<SVGIcon name="add-line" width="12" height="12" />
				</button>
				<div class="item-edit">
					<div class="item-move"
						v-drag="{ 
							channels: ['list'],
							filter: (el:HTMLElement) => [el.closest('.item-line')],
							callbacks: {
								effects: [{
									selectors: '.item-line',
									action: onDrag
								}]
							}
						}">
						<SVGIcon name="drag-move-2-fill" width="24" height="24" />
					</div>
					<div class="item-form">
						<slot name="editor" :index="i"></slot>
					</div>
				</div>
			</template>
			<slot v-else name="item" :item="item" :index="i"></slot>
		</div>
		<button v-if="edit" class="add-button" @click="() => list.push(emptyItem as T)">
			<SVGIcon name="add-line" width="12" height="12" />
		</button>
	</div>
</template>

<style scoped>
.list > div {
	display: flex;
}

.list.edit > div {
	flex-direction: column;
}

.add-button {
	width: 100%;
	height: 16px;
    line-height: 0;
}

.item-edit {
	display: flex;
	flex-grow: 1;
	border-width: 0px 1px;
	border-style: solid;
	border-color: var(--1-txt);
}

.item-form {
	display: flex;
	flex-direction: column;
	width: calc(100% - 33px);
}

.item-move {
	position: relative;
	width: 32px;
	border-right: 1px solid var(--1-txt);
	-webkit-user-drag: element;
	cursor: move;
}

.item-line {
	transition: 200ms;
}

.dragover:not(.dragged) {
	background-color: var(--1-txt);
	color: var(--2-bg);
}

[draggable] {
	user-select: none;
}

.item-move > svg {
	position: absolute; 
    top: 50%; 
    left: 50%; 
    transform: translate(-50%, -50%); 
}

@media screen and (max-width: 360px) /*Phone media querie*/
{
	.list {
		height: 100%;
	}

	.list > div {
		min-height: 100%;
		scroll-snap-align: start;
	}
}
</style>