const baseModel = require('../../common/model/baseModel');
const EnumDelType = require('../../common/constants/EnumCommon').EnumDelType;
const mkDeletedWhere = (_soft_del_field) => _soft_del_field ? {[_soft_del_field]: ['!=', EnumDelType.no]} : {};

module.exports = class extends baseModel {
    constructor(...args) {
        super(...args);
        this._pk = 'id';                        // 设置主键字段
        this._soft_del_field = 'deleted_at';    // 软删除标记字段
    }

    /**
     * 设置表名
     * @returns {string}
     */
    get tableName () {
        return 'visual_screen';
    }

    /**
     * 添加额外的schema数据
     * @returns {{deleted_at: {default: number}, created_at: {default: (function(): number)}, updated_at: {update: boolean, default: (function(): number)}}}
     */
    get schema() {
        return {
            deleted_at: {
                default: EnumDelType.no
            },
            created_at: {
                default: () => Date.now()
            },
            updated_at: {
                update: true,
                default: () => Date.now()
            }
        }
    }

    /**
     * 获取已删除数据
     * @param options
     * @param pageFlag
     */
    deletedCountSelect(options, pageFlag) {
        this.checkSoftDelField();
        return this.where(mkDeletedWhere(this._soft_del_field)).countSelect(options, pageFlag);
    }

    /**
     * 还原删除
     * @return {*}
     */
    undoDel() {
        this.checkSoftDelField();
        return this.update(this._soft_del_field ? {[this._soft_del_field]: EnumDelType.no} : {});
    }
};
