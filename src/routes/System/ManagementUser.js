import React, {PureComponent} from 'react';
import Bind from 'lodash-decorators/bind';
import { Link } from 'dva/router'
import DataTable from '../../components/DataTable/DataTable';
import {
    Card,
    Badge,
    Divider,
    Modal,
} from 'antd';
import moment from 'moment';
import Filter from './FilterUser'
import styles from './List.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const confirm = Modal.confirm;
export default class ManagementDepartment extends PureComponent {
    state = {
        selectedRows: [],
    };

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
        const status = ['否', '是'];
        const self = this;
        const statusMap = ['0', '1'];
        const columns = [
            {
              title: 'ID',
              dataIndex: 'no',
            },
            {
              title: '用户名',
              dataIndex: 'name',
            },
            {
              title: '工号',
              dataIndex: 'num',
            },
            {
              title: '所属部门',
              dataIndex: 'departmentname',
            },
            {
                title: '邮箱',
                dataIndex: 'mail',
            },
            {
                title: '激活',
                dataIndex: 'active',
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
                title: '上次登录时间',
                dataIndex: 'updatedAt',
                sorter: true,
                render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
            },
            {
                title: '操作',
                render: function(item){
                    if(item.status == 1){
                        return(
                            <div>  
                              <Link to={`/system/management_user/management_user_detail/${item.no}`}>
                                详情
                              </Link>
                              <Divider type="vertical"/>
                              <a onClick={() => self.handleRemove(item.no)}>删除</a>
                            </div>
                        );
                    }else{
                        return(
                            <div>
                              <Link to={`/system/management_user/management_user_detail/${item.no}`}>
                                详情
                              </Link>
                              <Divider type="vertical"/> 
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
            list: [{
                'no': 1,
                'status': 1,
            }, {
                'no': 2,
                'status': 0,
            }],
            selectedRows: [

            ],
            onSelectRow: (rows) => {
                this.setState({
                  selectedRows: rows,
                });
            },
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
        );
    }
}