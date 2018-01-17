import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Input, Button, Card, Radio } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Edit.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const STATE_KEY = 'franchiser_edit';

@connect(state => ({
  franchiserEdit: state[STATE_KEY],
  loading: state.loading,
}))

@Form.create()
export default class FranchiserEdit extends PureComponent {
  componentDidMount() {
    const { dispatch, match } = this.props;
    const payload = match.params;
    dispatch({
      type: `${STATE_KEY}/get`,
      payload,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { form, dispatch, match } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: `${STATE_KEY}/save`,
          payload: {
            ...values,
            id: match.params.id,
          },
        });
      }
    });
  }

  handleBack() {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push('/basic/franchiser/list')
    );
  }

  render() {
    const { loading, form, franchiserEdit } = this.props;
    const submitting = loading.effects[STATE_KEY];
    const { record } = franchiserEdit;
    const { getFieldDecorator } = form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="标题"
            >
              {getFieldDecorator('title', {
                initialValue: record.title,
                rules: [{
                  required: true, message: '请输入标题',
                }],
              })(
                <Input placeholder="给目标起个名字" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="目标描述"
            >
              {getFieldDecorator('description', {
                initialValue: record.description,
                rules: [{
                  required: true, message: '请输入目标描述',
                }],
              })(
                <TextArea style={{ minHeight: 32 }} placeholder="请输入你的阶段性工作目标" rows={4} />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="状态"
              help="数据的状态"
            >
              {getFieldDecorator('status', {
                initialValue: String(record.status || 1),
              })(
                <Radio.Group>
                  <Radio value="0">关闭</Radio>
                  <Radio value="1">运行中</Radio>
                  <Radio value="2">已上线</Radio>
                  <Radio value="3">异常</Radio>
                </Radio.Group>
              )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={() => this.handleBack()}>返回</Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
