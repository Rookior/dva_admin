import React, { PureComponent } from 'react';
import moment from 'moment';
import { Table, Alert, Badge, Popconfirm, Divider } from 'antd';
import styles from './index.less';
import TestModal from './TestModal';

const statusMap = ['default', 'processing', 'success', 'error'];
class SupplierTable extends PureComponent {
  state = {
    selectedRowKeys: [],
    totalCallNo: 0,
  };
  componentWillReceiveProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      this.setState({
        selectedRowKeys: [],
        totalCallNo: 0,
      });
    }
  }
  deleteHandler(id) {
    console.log('点击删除触发');
    console.log(id);
  }
  editHandler(id, values) {
    console.log('点击编辑触发');
    console.log(values);
  }
  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const totalCallNo = selectedRows.reduce((sum, val) => {
      return sum + parseFloat(val.callNo, 10);
    }, 0);

    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys, totalCallNo });
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  }

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }

  render() {
    const { selectedRowKeys, totalCallNo } = this.state;
    const { data: { list, pagination }, loading } = this.props;

    const status = ['否', '是'];

    const columns = [
      {
        title: 'ID',
        dataIndex: 'key',
      },
      {
        title: '供货品牌',
        dataIndex: 'title',
      },
      {
        title: '用户名',
        dataIndex: 'owner',
      },
      {
        title: 'UID',
        dataIndex: 'no',
      },
      {
        title: '联系电话',
        dataIndex: 'callNo',
      },
      {
        title: '联系人',
        dataIndex: 'progress',
      },
      {
        title: '开通供应链金融',
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
          return <Badge status={statusMap[val]} text={status[val]} />;
        },
      },
      {
        title: '入驻时间',
        dataIndex: 'startAt',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '到期时间',
        dataIndex: 'endAt',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        render: (text, record) => (
          <div>
            <TestModal record={record} onOk={this.editHandler.bind(null, record.key)}>
              <a>编辑</a>
            </TestModal>
            <Divider type="vertical" />
            <Popconfirm title="Confirm to delete?" onConfirm={this.deleteHandler.bind(null, record.key)}>
              <a href="">删除</a>
            </Popconfirm>
          </div>
        ),
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };

    return (
      <div className={styles.standardTable}>
        <div className={styles.tableAlert}>
          <Alert
            message={(
              <div>
                已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                服务调用总计 <span style={{ fontWeight: 600 }}>{totalCallNo}</span> 万
                <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>清空</a>
              </div>
            )}
            type="info"
            showIcon
          />
        </div>
        <Table
          loading={loading}
          rowKey={record => record.key}
          rowSelection={rowSelection}
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default SupplierTable;
