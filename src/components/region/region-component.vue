<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: fyf
 * @Date: 2021-09-29 18:04:57
 * @LastEditors: fyf
 * @LastEditTime: 2022-03-18 18:41:13
-->
<template>
    <div class="region-container">
        <div v-if="regionData.length" class="region-info">
            <div class="region-info-list">
                <div class="region-info-item" v-for="(item,index) in regionData" :key="index">
                    <span>{{item.value}}</span>
                    <Icon type="ios-close" class="region-info-icon" v-if="!disabled" @click="handleRemoveChecked(item,index)" />
                </div>
            </div>
            <Button class="btn" @click="handleReset" v-if="!disabled">重置</Button>
        </div>
        <div class="region-content">
            <region-list :disabled="disabled" :listData="provinceList" v-if="provinceList && provinceList.length" type="province" @next="getNext" @checked="handleChecked"></region-list>
            <region-list :disabled="disabled" :listData="cityList" v-if="city && cityList && cityList.length" type="city" @next="getNext" @checked="handleChecked"></region-list>
            <region-list :disabled="disabled" :listData="areaList" v-if="city && area && areaList && areaList.length" type="area" @next="getNext" @checked="handleChecked"></region-list>
            <region-list :disabled="disabled" :listData="townList" v-if="city && area && town && townList && townList.length" type="town" @next="getNext" @checked="handleChecked"></region-list>
        </div>
    </div>
</template>

<script>
import { srcProvince } from './region-data/formatted'
import { loadCity, loadArea, loadTown } from './region-data/helper'
import regionList from "./components/region-list"
export default {
    components: { regionList },
    model: {
        prop: "regionList",
        event: "change"
    },
    props: {
        regionList: {
            type: Array,
            default: () => []
        },
        city: {
            type: Boolean,
            default: () => true
        },
        area: {
            type: Boolean,
            default: () => true
        },
        town: {
            type: Boolean,
            default: () => true
        },
        disabled: {
            type: Boolean,
            default: () => false
        }
    },
    data() {
        return {
            provinceList: [],
            cityList: [],
            areaList: [],
            townList: [],
            indexList: [],
            regionData: [], // 选中节点
            srcProvince: JSON.parse(JSON.stringify(srcProvince))
        }
    },
    watch: {
        regionList() {
            this.regionData = this.regionList;
            this.initData();
        },
    },
    mounted() {
        this.regionData = this.regionList;
        this.initData();
    },
    methods: {
        initData() {
            this.provinceList = this.handleInitData(null, this.srcProvince, 'province', loadCity);
        },
        getNext(data) {
            let { type } = data;
            let [provinceIndex, cityIndex, areaIndex] = this.indexList;
            if (type == 'province') {
                // 初始化
                this.handleClearData(data, this.provinceList, provinceIndex, false);
                this.cityList = this.handleInitData(data, loadCity(data), 'city', loadArea);
            }
            else if (type == 'city') {
                // 初始化
                this.handleClearData(data, this.cityList, cityIndex, false);
                this.areaList = this.handleInitData(data, loadArea(data), 'area', loadTown);
            }
            else if (type == 'area') {
                // 初始化
                this.handleClearData(data, this.areaList, areaIndex, false);
                this.townList = this.handleInitData(data, loadTown(data), 'town');
            }
        },
        /* 是否有下级显示 */
        handleInitData(parentData, data, type, func) {
            data.map(item => {
                // 初始化省信息
                if (type == 'province') {
                    this.$set(item, 'isChildren', this.city && func(item).length ? true : false);
                    let records = this.regionData.filter(res => res.key.includes(item.key));
                    if (!records.length) {
                        this.$set(item, 'checked', false);
                        this.$set(item, 'indeterminate', false);
                    } else {
                        records.map(keys => {
                            let keyData = keys.key.split('-');
                            let keyLen = keyData.length;
                            if (keyLen == 1) {
                                if (item.key == keyData[0]) {
                                    this.$set(item, 'checked', true);
                                    this.$set(item, 'indeterminate', false);
                                }
                            } else {
                                if (item.key == keyData[0]) {
                                    this.$set(item, 'checked', false);
                                    this.$set(item, 'indeterminate', true);
                                }
                            }
                        })
                    }
                    // 初始化 市信息
                } else if (type == 'city') {
                    this.$set(item, 'isChildren', this.city && this.area && func(item).length ? true : false);
                    if (parentData.checked) {
                        this.$set(item, 'checked', true);
                        this.$set(item, 'indeterminate', false);
                    } else {
                        let records = this.regionData.filter(res => res.key.includes(item.key));

                        if (!records.length) {
                            this.$set(item, 'checked', false);
                            this.$set(item, 'indeterminate', false);
                        } else {
                            records.map(keys => {
                                let keyData = keys.key.split('-');
                                let keyLen = keyData.length;
                                if (keyLen == 2) {
                                    if (item.key == keyData[1]) {
                                        this.$set(item, 'checked', true);
                                        this.$set(item, 'indeterminate', false);
                                    }
                                } else {
                                    if (item.key == keyData[1]) {
                                        this.$set(item, 'checked', false);
                                        this.$set(item, 'indeterminate', true);
                                    }
                                }
                            })
                        }
                    }

                    // 初始化 区信息
                } else if (type == 'area') {
                    this.$set(item, 'isChildren', this.city && this.area && this.town && func(item).length ? true : false);
                    if (parentData.checked) {
                        this.$set(item, 'checked', true);
                        this.$set(item, 'indeterminate', false);
                    } else {
                        let records = this.regionData.filter(res => res.key.includes(item.key));
                        if (!records.length) {
                            this.$set(item, 'checked', false);
                            this.$set(item, 'indeterminate', false);
                        } else {
                            records.map(keys => {
                                let keyData = keys.key.split('-');
                                let keyLen = keyData.length;
                                if (keyLen == 3) {
                                    if (item.key == keyData[2]) {
                                        this.$set(item, 'checked', true);
                                        this.$set(item, 'indeterminate', false);
                                    }
                                } else {
                                    if (item.key == keyData[2]) {
                                        this.$set(item, 'checked', false);
                                        this.$set(item, 'indeterminate', true);
                                    }
                                }
                            })
                        }
                    }
                    // 初始化 街道信息
                } else if (type == 'town') {
                    item['isChildren'] = false;
                    if (parentData.checked) {
                        this.$set(item, 'checked', true);
                        this.$set(item, 'indeterminate', false);
                    } else {
                        let records = this.regionData.filter(res => res.key.includes(item.key));
                        if (!records.length) {
                            this.$set(item, 'checked', false);
                            this.$set(item, 'indeterminate', false);
                        } else {
                            records.map(keys => {
                                let keyData = keys.key.split('-');
                                let keyLen = keyData.length;
                                let townKey = item.key + "000";
                                if (keyLen == 4) {
                                    if (townKey == keyData[3]) {
                                        this.$set(item, 'checked', true);
                                        this.$set(item, 'indeterminate', false);
                                    }
                                }
                            })
                        }
                    }
                }
            })
            return data;
        },
        handleChecked(data) {
            let { type, checked, key, value } = data;
            let [provinceIndex, cityIndex, areaIndex] = this.indexList;
            if (type == 'province') {
                // 初始化
                this.handleClearData(data, this.provinceList, provinceIndex, true);

                // 省选中 改变子级状态
                this.cityList.map(item => { item.checked = checked; item.indeterminate = false });
                this.areaList.map(item => { item.checked = checked; item.indeterminate = false });
                this.townList.map(item => { item.checked = checked; item.indeterminate = false });

                // 选中
                if (checked) {
                    // 初始化 当前省以及子节点
                    this.handleRemoveSonNode(key, true);

                    this.regionData.unshift({ key, value });
                } else {
                    // 初始化 当前省以及子节点
                    this.handleRemoveSonNode(key, true);
                }
            }

            if (type == 'city') {
                // 初始化
                this.handleClearData(data, this.cityList, cityIndex, true);

                // 市选中 推算省状态
                this.handleCheckedStatus(provinceIndex, type, this.provinceList, this.cityList);
                // 市选中 改变区状态
                this.areaList.map(item => { item.checked = checked; item.indeterminate = false });
                // 市选中 改变街道状态
                this.townList.map(item => { item.checked = checked; item.indeterminate = false });
                /* 塞值 */
                let { key: pKey, value: pValue, checked: pChecked } = this.provinceList[provinceIndex];
                if (checked) {
                    if (pChecked) {
                        // 初始化 当前省以及子节点
                        this.handleRemoveSonNode(pKey, true);
                        this.regionData.unshift({ key: pKey, value: pValue })
                    } else {
                        // 初始化 当前市以及子节点
                        this.handleRemoveSonNode(key, true);
                        let mixinsKey = Array.of(pKey, key).join('-');
                        let mixinsValue = Array.of(pValue, value).join('-');
                        this.regionData.unshift({ key: mixinsKey, value: mixinsValue })
                    }
                } else {
                    // 初始化 当前省节点
                    this.handleRemoveSonNode(pKey, false);
                    // 初始化 当前市以及子节点
                    this.handleRemoveSonNode(key, true);
                    // 重新赋值 市节点
                    this.cityList.map(item => {
                        let mixinsKey = Array.of(pKey, item.key).join('-');
                        let mixinsValue = Array.of(pValue, item.value).join('-');
                        if (item.checked) {
                            if (!this.handleIsAddNode(mixinsKey)) {
                                this.regionData.unshift({ key: mixinsKey, value: mixinsValue })
                            }
                        } else {
                            if (this.handleIsAddNode(mixinsKey)) {
                                this.handleRemoveSonNode(mixinsKey, false);
                            }
                        }
                    })
                }
            }

            if (type == 'area') {
                // 初始化
                this.handleClearData(data, this.areaList, areaIndex, true);

                // 区选中 推算市状态
                this.handleCheckedStatus(cityIndex, type, this.cityList, this.areaList);
                // 区选中 推算省状态
                this.handleCheckedStatus(provinceIndex, type, this.provinceList, this.cityList);

                // 区选中 改变街道状态
                this.townList.map(item => { item.checked = checked; item.indeterminate = false });


                // 塞值
                let { key: pKey, value: pValue, checked: pChecked } = this.provinceList[provinceIndex];
                let { key: cKey, value: cValue, checked: cChecked } = this.cityList[cityIndex];
                if (checked) {
                    // 省选中
                    if (pChecked) {
                        // 初始化 当前省以及子节点
                        this.handleRemoveSonNode(pKey, true);
                        this.regionData.unshift({ key: pKey, value: pValue })
                        // 市选中
                    } else if (cChecked) {
                        // 初始化 当前市以及子节点
                        this.handleRemoveSonNode(cKey, true);
                        let mixinsKey = Array.of(pKey, cKey).join('-');
                        let mixinsValue = Array.of(pValue, cValue).join('-');
                        this.regionData.unshift({ key: mixinsKey, value: mixinsValue })
                        // 区选中
                    } else {
                        // 初始化 当前区以及子节点
                        this.handleRemoveSonNode(key, true);
                        let mixinsKey = Array.of(pKey, cKey, key).join('-');
                        let mixinsValue = Array.of(pValue, cValue, value).join('-');
                        this.regionData.unshift({ key: mixinsKey, value: mixinsValue })
                    }
                } else {

                    // 初始化省节点
                    this.handleRemoveSonNode(pKey, false);
                    // 初始化 当前市节点
                    this.handleRemoveSonNode(cKey, false);
                    // 初始化当前区以及子节点
                    this.handleRemoveSonNode(key, true);
                    // 重新赋值 市节点
                    this.cityList.map(item => {
                        let mixinsKey = Array.of(pKey, item.key).join('-');
                        let mixinsValue = Array.of(pValue, item.value).join('-');
                        if (item.checked) {
                            if (!this.handleIsAddNode(mixinsKey)) {
                                this.regionData.unshift({ key: mixinsKey, value: mixinsValue })
                            }
                        } else {
                            if (this.handleIsAddNode(mixinsKey)) {
                                this.handleRemoveSonNode(mixinsKey, false);
                            }
                        }
                    })
                    // 重新赋值 区节点
                    this.areaList.map(item => {
                        let mixinsKey = Array.of(pKey, cKey, item.key).join('-');
                        let mixinsValue = Array.of(pValue, cValue, item.value).join('-');
                        if (item.checked) {
                            if (!this.handleIsAddNode(mixinsKey)) {
                                this.regionData.unshift({ key: mixinsKey, value: mixinsValue })
                            }
                        } else {
                            if (this.handleIsAddNode(mixinsKey)) {
                                this.handleRemoveSonNode(mixinsKey, false);
                            }
                        }
                    })
                }

            }
            if (type == 'town') {
                let [provinceIndex, cityIndex, areaIndex] = this.indexList;
                // 街道key 拼接
                let townKey = key + '000';
                // 街道选中 推算区状态
                this.handleCheckedStatus(areaIndex, type, this.areaList, this.townList);
                // 街道选中 推算市状态
                this.handleCheckedStatus(cityIndex, type, this.cityList, this.areaList);
                // 街道选中 推算省状态
                this.handleCheckedStatus(provinceIndex, type, this.provinceList, this.cityList);


                /* 塞值 */
                let { key: pKey, value: pValue, checked: pChecked } = this.provinceList[provinceIndex];
                let { key: cKey, value: cValue, checked: cChecked } = this.cityList[cityIndex];
                let { key: aKey, value: aValue, checked: aChecked } = this.areaList[areaIndex];
                if (checked) {
                    // 省选中
                    if (pChecked) {
                        // 初始化 当前省以及子节点
                        this.handleRemoveSonNode(pKey, true);
                        this.regionData.unshift({ key: pKey, value: pValue })
                        // 市选中
                    } else if (cChecked) {
                        // 初始化 当前市以及子节点
                        this.handleRemoveSonNode(cKey, true);
                        let mixinsKey = Array.of(pKey, cKey).join('-');
                        let mixinsValue = Array.of(pValue, cValue).join('-');
                        this.regionData.unshift({ key: mixinsKey, value: mixinsValue })
                        // 区选中
                    } else if (aChecked) {
                        // 初始化 当前区以及子节点
                        this.handleRemoveSonNode(aKey, true);
                        let mixinsKey = Array.of(pKey, cKey, aKey).join('-');
                        let mixinsValue = Array.of(pValue, cValue, aValue).join('-');
                        this.regionData.unshift({ key: mixinsKey, value: mixinsValue })
                        // 街道选中
                    } else {
                        // 初始化 当前街道节点
                        this.handleRemoveSonNode(townKey, true);
                        let mixinsKey = Array.of(pKey, cKey, aKey, townKey).join('-');
                        let mixinsValue = Array.of(pValue, cValue, aValue, value).join('-');
                        this.regionData.unshift({ key: mixinsKey, value: mixinsValue })
                    }
                } else {
                    // 初始化省节点
                    this.handleRemoveSonNode(pKey, false);
                    // 初始化当前市节点
                    this.handleRemoveSonNode(cKey, false);
                    // 初始化当前区节点
                    this.handleRemoveSonNode(aKey, false);
                    // 初始化当前街道节点
                    this.handleRemoveSonNode(townKey, true);
                    // 重新赋值 市节点
                    this.cityList.map(item => {
                        let mixinsKey = Array.of(pKey, item.key).join('-');
                        let mixinsValue = Array.of(pValue, item.value).join('-');
                        if (item.checked) {
                            if (!this.handleIsAddNode(mixinsKey)) {
                                this.regionData.unshift({ key: mixinsKey, value: mixinsValue })
                            }
                        } else {
                            if (this.handleIsAddNode(mixinsKey)) {
                                this.handleRemoveSonNode(mixinsKey, false);
                            }
                        }
                    })
                    // 重新赋值 区节点
                    this.areaList.map(item => {
                        let mixinsKey = Array.of(pKey, cKey, item.key).join('-');
                        let mixinsValue = Array.of(pValue, cValue, item.value).join('-');
                        if (item.checked) {
                            if (!this.handleIsAddNode(mixinsKey)) {
                                this.regionData.unshift({ key: mixinsKey, value: mixinsValue })
                            }
                        } else {
                            if (this.handleIsAddNode(mixinsKey)) {
                                this.handleRemoveSonNode(mixinsKey, false);
                            }
                        }
                    })
                    // 重新赋值 街道节点
                    this.townList.map(item => {
                        let townKey = item.key + "000";
                        let mixinsKey = Array.of(pKey, cKey, aKey, townKey).join('-');
                        let mixinsValue = Array.of(pValue, cValue, aValue, item.value).join('-');
                        if (item.checked) {
                            if (!this.handleIsAddNode(mixinsKey)) {
                                this.regionData.unshift({ key: mixinsKey, value: mixinsValue })
                            }
                        } else {
                            if (this.handleIsAddNode(mixinsKey)) {
                                this.handleRemoveSonNode(mixinsKey, false);
                            }
                        }
                    })
                }
            }

            this.$emit('change', this.regionData);
        },
        /* 节点选中判断 */
        handleCheckedStatus(index, type, preData, data) {
            let records = data.filter(item => item.checked == true);
            if (!records.length) {
                if (type != "[province]") {
                    let indeterminateList = data.filter(item => item.indeterminate == true);
                    if (indeterminateList.length) {
                        preData[index]['indeterminate'] = true;
                    } else {
                        preData[index]['indeterminate'] = false;
                    }
                } else {
                    preData[index]['indeterminate'] = false;
                }
                preData[index]['checked'] = false;
            } else {
                if (records.length == data.length) {
                    preData[index]['indeterminate'] = false;
                    preData[index]['checked'] = true;
                } else {
                    preData[index]['indeterminate'] = true;
                    preData[index]['checked'] = false;
                }
            }
        },
        /* 初始化数据状态 */
        handleClearData(data, dataList, currentIndex, isShowIndeterminate) {
            let { type, index, indeterminate } = data;
            if (type == "province") {
                if (currentIndex != index) {
                    this.cityList = [];
                    this.areaList = [];
                    this.townList = [];
                    this.indexList[0] = index;
                }
            } else if (type == "city") {
                if (currentIndex != index) {
                    this.areaList = [];
                    this.townList = [];
                    this.indexList[1] = index;
                }
            } else if (type == "area") {
                if (currentIndex != index) {
                    this.townList = [];
                    this.indexList[2] = index;
                }
            }
            if (indeterminate && isShowIndeterminate) {
                dataList[index]['indeterminate'] = false;
            }
        },
        /* 判断节点是否已添加 */
        handleIsAddNode(key) {
            if (!this.regionData.length) return;
            let isAdd = this.regionData.some(item => item.key === key);
            return isAdd;
        },
        /* 移除节点 */
        handleRemoveSonNode(key, isIncludes) {
            if (!this.regionData.length) return;
            for (let i = this.regionData.length - 1; i >= 0; i--) {
                let keys = this.regionData[i]['key'];
                // 是否清空当前与子节点
                if (isIncludes) {
                    if (keys.includes(key)) {
                        this.regionData.splice(i, 1)
                    }
                } else {
                    if (keys == key) {
                        this.regionData.splice(i, 1)
                    }
                }
            }
        },
        /* 删除选中节点 */
        handleRemoveChecked(data, index) {
            this.$Modal.confirm({
                title: '操作提示',
                content: '请确认是否删除当前选中项',
                onOk: () => {
                    this.regionData.splice(index, 1);
                    let { key, value } = data;
                    let keyList = key.split('-');
                    let keyLen = keyList.length;
                    this.pIndex = this.provinceList.findIndex(item => item.key == keyList[0]);
                    if (keyLen == 1) {
                        let params = { type: "province", value, key: keyList[0], index: this.pIndex, checked: false, indeterminate: false };
                        // 在当前数据里 
                        this.provinceList[this.pIndex]['checked'] = false;
                        this.handleChecked(params);
                    }
                    if (keyLen == 2) {
                        let idx = this.cityList.length ? this.cityList.findIndex(item => item.key == keyList[1]) : -1;
                        let params = { type: "city", value, key: keyList[1], index: idx, checked: false, indeterminate: false };
                        if (idx > -1) {
                            this.cityList[idx]['checked'] = false;
                            this.handleChecked(params);
                        } else {
                            let records = this.regionData.length ? this.regionData.filter(item => item.key.includes(keyList[0])) : [];
                            if (!records.length) {
                                this.provinceList[this.pIndex]['indeterminate'] = false;
                            }
                        }
                    }
                    if (keyLen == 3) {
                        let idx = this.areaList.length ? this.areaList.findIndex(item => item.key == keyList[2]) : -1;
                        this.cIndex = this.cityList.length ? this.cityList.findIndex(item => item.key == keyList[1]) : -1;
                        let params = { type: "area", value, key: keyList[2], index: idx, checked: false, indeterminate: false };
                        if (idx > -1) {
                            this.areaList[idx]['checked'] = false;
                            this.handleChecked(params);
                        } else {
                            let cRecords = this.regionData.length ? this.regionData.filter(item => item.key.includes(keyList[1])) : [];
                            if (!cRecords.length) {
                                this.cIndex > 0 ? this.cityList[this.cIndex]['indeterminate'] = false : null;
                            }
                            let pRecords = this.regionData.length ? this.regionData.filter(item => item.key.includes(keyList[0])) : [];
                            if (!pRecords.length) {
                                this.provinceList[this.pIndex]['indeterminate'] = false;
                            }
                        }
                    }
                    if (keyLen == 4) {
                        let key = keyList[3];
                        let townKey = key.slice(0, -3);
                        let idx = this.townList.length ? this.townList.findIndex(item => item.key == townKey) : -1;
                        this.cIndex = this.cityList.length ? this.cityList.findIndex(item => item.key == keyList[1]) : -1;
                        this.aIndex = this.areaList.length ? this.areaList.findIndex(item => item.key == keyList[2]) : -1;
                        let params = { type: "town", value, key: townKey, index: idx, checked: false, indeterminate: false };
                        if (idx > -1) {
                            this.townList[idx]['checked'] = false;
                            this.handleChecked(params);
                        } else {
                            let aRecords = this.regionData.length ? this.regionData.filter(item => item.key.includes(keyList[2])) : [];
                            if (!aRecords.length) {
                                this.aIndex > 0 ? this.areaList[this.aIndex]['indeterminate'] = false : null;
                            }
                            let cRecords = this.regionData.length ? this.regionData.filter(item => item.key.includes(keyList[1])) : [];
                            if (!cRecords.length) {
                                this.cIndex > 0 ? this.cityList[this.cIndex]['indeterminate'] = false : null;
                            }
                            let pRecords = this.regionData.length ? this.regionData.filter(item => item.key.includes(keyList[0])) : [];
                            if (!pRecords.length) {
                                this.provinceList[this.pIndex]['indeterminate'] = false;
                            }
                        }
                    }

                    this.$emit('change', this.regionData);
                },
                onCancel: () => {

                }
            });

        },
        handleReset() {
            this.provinceList.length && this.provinceList.map(item => { item.checked = false; item.indeterminate = false });
            this.cityList = [];
            this.areaList = [];
            this.townList = [];
            this.regionData = [];
        }
    }
}
</script>

<style lang="less" scoped>
.region-container {
    padding: 20px;
}
.region-content {
    height: 300px;
    display: flex;
    flex-flow: row nowrap;
    margin-top: 20px;
}
.region-info {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    align-items: flex-end;
    .btn {
        margin-left: 20px;
    }
}
.region-info-list {
    flex: 1;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    max-height: 108px;
    overflow-y: auto;
    display: flex;
    flex-flow: row wrap;
    .region-info-item {
        display: inline-block;
        border: 1px solid #e4e7ed;
        border-radius: 4px;
        margin: 2px 4px;
        cursor: pointer;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        span {
            display: inline-block;
        }
        .region-info-icon {
            padding: 2px;
            font-size: 20px;
        }
        &:hover {
            color: #409eff;
            border: 1px solid #409eff;
            .region-info-icon {
                color: #409eff;
            }
        }
    }
}
</style>