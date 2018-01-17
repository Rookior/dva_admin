import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {routerRedux, Link} from 'dva/router'
import Bind from 'lodash-decorators/bind';
import {
  Card,
  Form,
  Button,
  Badge,
  Divider,
  notification,
  Modal,
} from 'antd';
import moment from 'moment';
import DataTable from '../../components/DataTable/DataTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {PreAuthorize} from '../../utils/Authorized';
import Filter from './Filter'
import styles from './List.less';


const confirm = Modal.confirm
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

const STATE_KEY = 'franchiser_list'
const FETCH_TYPE = `${STATE_KEY}/fetch`
/**
 * 下面注解的写等价于：export default connect( state => ({ franchiser:state.franchiser, loading: state.loading.models.franchiser }))(Form.create()(FranchiserList))
 */
@connect(state => ({
  franchiser: state[STATE_KEY],
  loading: state.loading,
}))
@Form.create()
export default class FranchiserList extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const {dispatch, location} = this.props;
    const payload = location.query
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
    const {dispatch} = this.props;

    const values = {
      ...fieldsValue,
      updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
    };

    this.setState({
      formValues: values,
    });

    dispatch({
      type: FETCH_TYPE,
      payload: values,
    });
  }

  @Bind()
  @PreAuthorize('admin')
  handleAdd() {
    const {dispatch} = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/basic/franchiser/edit/0'
      })
    );
  }

  @Bind()
  @PreAuthorize('admin')
  handleRemove(id) {
    const {dispatch} = this.props;
    const {selectedRows} = this.state;
    const doDel = () => {
      dispatch({
        type: `${STATE_KEY}/remove`,
        payload: {
          key: id || selectedRows.map(row => row.key).join(','),
        },
        callback: () => {
          notification.info({
            message: `删除成功`,
          });
          if (!id) {
            this.setState({
              selectedRows: [],
            });
          }
        },
      });
    }
    confirm({
      title: '你是否确定删除本条记录?',
      onOk () {
        doDel();
      },
    })

  }

  render() {
    const {location, loading, franchiser} = this.props;
    const {list, pagination} = franchiser
    const {selectedRows} = this.state;
    const status = ['关闭', '运行中', '已上线', '异常'];
    const statusMap = ['default', 'processing', 'success', 'error'];
    const columns = [
      {
        title: '规则编号',
        dataIndex: 'no',
      },
      {
        title: '描述',
        dataIndex: 'description',
      },
      {
        title: '服务调用次数',
        dataIndex: 'callNo',
        sorter: true,
        align: 'right',
        render: val => `${val} 万`,
      },
      {
        title: '状态',
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
          {
            text: status[2],
            value: 2,
          },
          {
            text: status[3],
            value: 3,
          },
        ],
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]}/>;
        },
      },
      {
        title: '更新时间',
        dataIndex: 'updatedAt',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        render: (item) => (
          <div>
            <a onClick={() => this.handleRemove(item.key)}>
              删除
            </a>
            <Divider type="vertical"/>
            <Link to={`/basic/franchiser/edit/${item.key}`}>
              编辑
            </Link>
          </div>
        ),
      },
    ];
    const tableProps = {
      rowKey: 'key',
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
    console.log(tableProps);

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <Filter {...this.props} handleSearch={this.handleSearch}/>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleAdd()}>
                新建
              </Button>
              {
                selectedRows.length > 0 && (
                  <span>
                    <Button icon="delete" onClick={() => this.handleRemove()}>批量删除</Button>
                  </span>
                )
              }
            </div>
            <DataTable {...tableProps} />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
