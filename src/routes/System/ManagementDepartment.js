import React, {PureComponent} from 'react';
import {connect} from 'dva';
import Bind from 'lodash-decorators/bind';
import DataTable from '../../components/DataTable/DataTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {
    Card,
    Form,
    Badge,
    Modal,
} from 'antd';
import Filter from './FilterDepartment';
import styles from './List.less';

const STATE_KEY = 'management_department';
const FETCH_TYPE = `${STATE_KEY}/fetch`;
const confirm = Modal.confirm;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
    franchiser: state[STATE_KEY],
    loading: state.loading,
}))
@Form.create()
export default class ManagementDepartment extends PureComponent {
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
        const {dispatch} = this.props;
        const {formValues} = this.state;
    
        const filters = Object.keys(filtersArg).reduce((obj, key) => {
          const newObj = {...obj};
          newObj[key] = getValue(filtersArg[key]);
          return newObj;
        }, {});
    
        const params = {
          currentPage: pagination.current,
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
        console.log(fieldsValue);
    }
    
    @Bind()
    handleRemove(id) {
        const {dispatch} = this.props;
        const {selectedRows} = this.state;
        const doDel = () => {
            console.log('确认删除'+id);
        }
        confirm({
        title: '你是否确定删除本条记录?',
        onOk () {
            doDel();
        },
        })

    }

    @Bind()
    handleRecover(id) {
        const {dispatch} = this.props;
        const {selectedRows} = this.state;
        const doDel = () => {
            console.log('确认恢复'+id);
        }
        confirm({
        title: '你是否确定恢复本条记录?',
        onOk () {
            doDel();
        },
        })

    }
    render() {
        const {location, loading, franchiser} = this.props;
        const {list, pagination} = franchiser;
        const {selectedRows} = this.state;
        const status = ['否', '是'];
        const self = this;
        const statusMap = ['0', '1'];
        const columns = [
            {
              title: 'ID',
              dataIndex: 'no',
            },
            {
              title: '部门名称',
              dataIndex: 'cityId',
            },
            {
              title: '部门ID',
              dataIndex: 'bank',
            },
            {
              title: '父部门名称',
              dataIndex: 'num',
            },
            {
                title: '父部门ID',
                dataIndex: 'tel',
            },
            {
                title: '有效',
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
                title: '操作',
                render: function(item){
                    if(item.status == 1){
                        return(
                            <div>  
                              <a onClick={() => self.handleRemove(item.no)}>删除</a>
                            </div>
                        );
                    }else{
                        return(
                            <div>  
                              <a onClick={() => self.handleRecover(item.no)}>恢复</a>
                            </div>
                        );
                    }
                   
                }
            },
            
        ];
        const tableProps = {
            rowKey: 'no',
            columns,
            list,
            selectedRows,
            loading: loading.effects[FETCH_TYPE],
            pagination,
            location,
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
                        <DataTable {...tableProps} />
                                  
                    </div>
                </Card>
            </PageHeaderLayout>
        )
    }
}