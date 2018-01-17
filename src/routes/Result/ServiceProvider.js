import React, {PureComponent} from 'react';
import {connect} from 'dva';
import Bind from 'lodash-decorators/bind';
import DataTable from '../../components/DataTable/DataTable';
import {
    Card,
    Form,
    Button,
    Badge,
    Divider,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import Filter from './Filter'
import styles from './List.less';
import moment from 'moment';

const STATE_KEY = 'service_provider'
const FETCH_TYPE = `${STATE_KEY}/fetch`
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
    franchiser: state[STATE_KEY],
    loading: state.loading,
}))
@Form.create()
export default class ServiceProvider extends PureComponent {
    state = {
        selectedRows: [],
    };

    componentDidMount() {
        const {dispatch, location} = this.props;
        const payload = location.query;
        console.log(location)
        dispatch({
          type: FETCH_TYPE,
          payload
        });
    }

    handleStandardTableChange = (pagination, filtersArg, sorter) => {
        console.log('分页变化');
        const {dispatch} = this.props;
        const {formValues} = this.state;

        const filters = Object.keys(filtersArg).reduce((obj, key) => {
        const newObj = {...obj};
        newObj[key] = getValue(filtersArg[key]);
        return newObj;
        }, {});

        const params = {
        pageNo: pagination.current,
        pageSize: pagination.pageSize,
        ...formValues,
        ...filters,
        };
        if (sorter.field) {
        params.sorter = `${sorter.field}_${sorter.order}`;
        }

        dispatch({
        type: FETCH_TYPE,
        payload: params,
        });
    }

    handleSearch = (fieldsValue) => {
        console.log('搜索'+fieldsValue);
    }

    @Bind()
    handleAdd() {
        console.log('新增');
    }

    @Bind()
    handleRemove(id) {
        console.log('删除'+id);
    }

    render() {
        const {location, loading, franchiser} = this.props;
        const {list, pagination} = franchiser
        const {selectedRows} = this.state;
        const status = ['否', '是'];
        const statusMap = ['0', '1'];
        const columns = [
            {
              title: 'ID',
              dataIndex: 'id',
            },
            {
              title: '所属地区',
              dataIndex: 'cityId',
            },
            {
              title: '对接银行',
              dataIndex: 'bank',
            },
            {
              title: '额度',
              dataIndex: 'num',
              render: val => `${val} 万`,
            },
            {
                title: '联系电话',
                dataIndex: 'tel',
            },
            {
                title: '联系人',
                dataIndex: 'platformName',
            },
            {
                title: '关闭供应链金融',
                dataIndex: 'status',
                filters: [
                  {
                    text: status[0],
                    value: 0,
                  },
                  {
                    text: status[1],
                    value: 1,
                  },
                ],
                render(val) {
                  return <Badge status={statusMap[val]} text={status[val]}/>;
                },
            },
            {
                title: '开通时间',
                dataIndex: 'startdAt',
                render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
            },
            {
                title: '最近到期还款时间',
                dataIndex: 'endAt',
                render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
            },
            {
                title: '操作',
                render: (item) => (
                  <div>  
                    <a>
                      编辑
                    </a>
                    <Divider type="vertical"/>
                    <a>
                      开启无忧付
                    </a>
                  </div>
                ),
            },
        ];
        const tableProps = {
            rowKey: 'id',
            columns,
            list,
            loading: loading.effects[FETCH_TYPE],
            pagination,
            selectedRows,
            onSelectRow: (rows) => {
                this.setState({
                  selectedRows: rows,
                });
            },
            onChange: this.handleStandardTableChange,
        }
        return (
            <PageHeaderLayout>
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <Filter {...this.props} handleSearch={this.handleSearch} />
                        <div className={styles.tableListOperator}>
                            <Button icon="plus" type="primary" onClick={() => this.handleAdd()}>
                                新建
                            </Button>
                            {
                                selectedRows.length > 0 && (
                                <span>
                                    <Button onClick={() => this.handleRemove()}>导出</Button>
                                </span>
                                )
                            }
                        </div>
                        <DataTable {...tableProps} />           
                    </div>
                </Card>
            </PageHeaderLayout>
        )
    }
}