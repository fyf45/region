<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: fyf
 * @Date: 2022-03-11 16:17:17
 * @LastEditors: fyf
 * @LastEditTime: 2022-03-17 18:47:44
-->
<template>
    <div class="list">
        <div class="item" :class="{'item-active':index === currentIndex && isClick}" v-for="(item,index) in list" :key="index">
            <Checkbox :disabled="disabled" @on-change="handleCheckChange($event,item,index)" :indeterminate="item.indeterminate" :value="item.checked"></Checkbox>
            <div class="txt-box" @click="handleClick(index,item)">
                <span class="txt">{{item.value}}</span>
                <Icon type="ios-arrow-forward" class="icon" v-if="item.isChildren" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        listData: {
            type: Array,
            default: () => []
        },
        type: {
            type: String,
            default: () => ""
        },
        disabled: {
            type: Boolean,
            default: () => false
        }
    },
    data() {
        return {
            currentIndex: null,
            isClick: false,
            isIndeterminate: false,
            list: []
        }
    },
    watch: {
        listData(newV, oldV) {
            this.clear();
            this.list = newV;
        }
    },
    mounted() {
        this.list = this.listData;
    },
    methods: {
        handleClick(index, item) {
            this.currentIndex = index;
            this.isClick = true;
            this.$emit("next", { ...item, index, type: this.type })

        },
        handleCheckChange(checked, item, index) {
            this.list[index]['checked'] = checked;
            this.currentIndex = index;
            this.isClick = true;
            this.$emit("checked", { ...item, index, checked, type: this.type })
        },
        clear() {
            this.currentIndex = null;
            this.isClick = false;
        }
    }
}
</script>

<style lang="less" scoped>
.list {
    width: 240px;
    height: 100%;
    overflow-y: auto;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    .item {
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
        .txt-box {
            flex: 1;
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            cursor: pointer;
        }
        &:hover {
            background: #f5f7fa;
        }
    }
    .item-active {
        .txt,
        .icon {
            color: #409eff;
            font-weight: 700;
        }
    }
    /deep/ .ivu-checkbox-checked .ivu-checkbox-inner {
        background-color: #409eff;
        border-color: #409eff;
    }
}
</style>