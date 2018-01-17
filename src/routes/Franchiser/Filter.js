import React, {PureComponent} from 'react';
import Bind from 'lodash-decorators/bind';
import {Row, Col, Form, Input, Select, Icon, Button, InputNumber, DatePicker} from 'antd';
import styles from './Filter.less'

const FormItem = Form.Item;
const {Option} = Select;
const ROW_PROPS = {md: 8, lg: 24, xl: 48};
const COL_PROPS = {md: 8, sm: 24}

@Form.create()
export default class FranchiserFilter extends PureComponent {
  state = {
    expandForm: false,
  };

  @Bind()
  handleFormReset() {
    const {form, handleSearch} = this.props;
    form.resetFields();
    handleSearch && handleSearch({})
  }

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  }

  handleSearch = (e) => {
    e.preventDefault();
    const {handleSearch, form} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleSearch && handleSearch(fieldsValue)
    });
  }

  renderSimpleForm() {
    const {form} = this.props
    const {getFieldDecorator} = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={ROW_PROPS}>
          <Col md={8} sm={24}>
            <FormItem label="规则编号">
              {getFieldDecorator('no')(
                <Input placeholder="请输入"/>
              )}
            </FormItem>
          </Col>
          <Col {...COL_PROPS}>
            <FormItem label="使用状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col {...COL_PROPS}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>重置</Button>
              <a style={{marginLeft: 8}} onClick={this.toggleForm}>
                展开 <Icon type="down"/>
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={ROW_PROPS}>
          <Col {...COL_PROPS}>
            <FormItem label="规则编号">
              {getFieldDecorator('no')(
                <Input placeholder="请输入"/>
              )}
            </FormItem>
          </Col>
          <Col {...COL_PROPS}>
            <FormItem label="使用状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col {...COL_PROPS}>
            <FormItem label="调用次数">
              {getFieldDecorator('number')(
                <InputNumber style={{width: '100%'}}/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={ROW_PROPS}>
          <Col {...COL_PROPS}>
            <FormItem label="更新日期">
              {getFieldDecorator('date')(
                <DatePicker style={{width: '100%'}} placeholder="请输入更新日期"/>
              )}
            </FormItem>
          </Col>
          <Col {...COL_PROPS}>
            <FormItem label="使用状态">
              {getFieldDecorator('status3')(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col {...COL_PROPS}>
            <FormItem label="使用状态">
              {getFieldDecorator('status4')(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{overflow: 'hidden'}}>
          <span style={{float: 'right', marginBottom: 24}}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>重置</Button>
            <a style={{marginLeft: 8}} onClick={this.toggleForm}>
              收起 <Icon type="up"/>
            </a>
          </span>
        </div>
      </Form>
    );
  }

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    return (
      <div className={styles.tableListForm}>
        {this.renderForm()}
      </div>
    );
  }
}
