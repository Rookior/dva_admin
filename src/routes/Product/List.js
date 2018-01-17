import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button } from 'antd';
import ProductTable from '../../components/ProductDetails';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './List.less';
import TestModal from '../../components/ProductDetails/TestModal';

const FormItem = Form.Item;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  list: state.product_details,
}))
@Form.create()
export default class List extends PureComponent {
    state = {
      selectedRows: [],
      formValues: {},
    };
    componentDidMount() {
      const { dispatch } = this.props;
      dispatch({
        type: 'product_details/fetch',
      });
    }
    handleStandardTableChange = (pagination, filtersArg, sorter) => {
      const { dispatch } = this.props;
      const { formValues } = this.state;
      const filters = Object.keys(filtersArg).reduce((obj, key) => {
        const newObj = { ...obj };
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
        type: 'list/fetch',
        payload: params,
      });
    }
    handleSelectRows = (rows) => {
      this.setState({
        selectedRows: rows,
      });
    }
    handleModalCreate = (values) => {
      console.log('点击新增触发');
      console.log(values);
    }
    renderSimpleForm() {
      const { getFieldDecorator } = this.props.form;
      return (
        <Form onSubmit={this.handleSearch} layout="inline">
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={24}>
              <FormItem label="名称">
                {getFieldDecorator('no')(
                  <Input placeholder="请输入" />
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="所属分类">
                {getFieldDecorator('no')(
                  <Input placeholder="请输入" />
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <span className={styles.submitButtons}>
                <Button type="primary" htmlType="submit">查询</Button>
              </span>
            </Col>
          </Row>
        </Form>
      );
    }
    renderForm() {
      return this.renderSimpleForm();
    }
    render() {
      const { list: { loading, data } } = this.props;
      const { selectedRows } = this.state;
      return (
        <PageHeaderLayout>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>
                {this.renderForm()}
              </div>
              <div className={styles.tableListOperator}>
                <TestModal record={{}} onOk={this.handleModalCreate}>
                  <Button icon="plus" type="primary">新建</Button>
                </TestModal>
                {
                  selectedRows.length > 0 && (
                    <span>
                      <Button>批量删除</Button>
                    </span>
                  )
                }
              </div>
              <ProductTable
                selectedRows={selectedRows}
                loading={loading}
                data={data}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            </div>
          </Card>
        </PageHeaderLayout>
      );
    }
}
