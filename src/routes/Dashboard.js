import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Icon, Tooltip } from 'antd';
import numeral from 'numeral';
import { ChartCard, yuan } from '../components/Charts';
import Trend from '../components/Trend';
import styles from './Dashboard.less';

class Dashboard extends PureComponent {
  state = {
    titleList: ['今日新品(个)', '本周新服务商', '今日订单数', '今日成交金额'],
    stateList: ['down', 'up', 'up', 'up'],
  };
  componentDidMount() {
    this.props.dispatch({
      type: 'user/fetch',
    });
  }
  render() {
    return (
      <div>
        <h3>数据概览</h3>
        <Row gutter={24}>
          <Col span={6} style={{ marginTop: 24 }}>
            <ChartCard
              title={this.state.titleList[0]}
              avatar={(
                <img
                  alt="indicator"
                  style={{ width: 56, height: 56 }}
                  src="https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png"
                />
              )}
              action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
              total={numeral(50).format('0,0')}
              footer={
                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                  <Trend flag={this.state.stateList[0]} style={{ marginRight: 16 }}>
                    周同比<span>12%</span>
                  </Trend>
                </div>
              }
            />
          </Col>
          <Col span={6} style={{ marginTop: 24 }}>
            <ChartCard
              title={this.state.titleList[1]}
              avatar={(
                <img
                  alt="indicator"
                  style={{ width: 56, height: 56 }}
                  src="https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png"
                />
              )}
              action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
              total={numeral(88).format('0,0')}
              footer={
                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                  <Trend flag={this.state.stateList[1]} style={{ marginRight: 16 }}>
                    周同比<span>12%</span>
                  </Trend>
                </div>
              }
            />
          </Col>
          <Col span={6} style={{ marginTop: 24 }}>
            <ChartCard
              title={this.state.titleList[2]}
              avatar={(
                <img
                  alt="indicator"
                  style={{ width: 56, height: 56 }}
                  src="https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png"
                />
              )}
              action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
              total={numeral(580).format('0,0')}
              footer={
                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                  <Trend flag={this.state.stateList[2]} style={{ marginRight: 16 }}>
                    周同比<span>12%</span>
                  </Trend>
                </div>
              }
            />
          </Col>
          <Col span={6} style={{ marginTop: 24 }}>
            <ChartCard
              title={this.state.titleList[3]}
              avatar={(
                <img
                  alt="indicator"
                  style={{ width: 56, height: 56 }}
                  src="https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png"
                />
              )}
              action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
              total={yuan(68323)}
              footer={
                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                  <Trend flag={this.state.stateList[3]} style={{ marginRight: 16 }}>
                    周同比<span>12%</span>
                  </Trend>
                </div>
              }
            />
          </Col>
        </Row>
        <Row gutter={24} style={{ marginTop: 24 }}>
          <Col span={16}>
            <Card
              title="订单交易趋势"
              bordered={false}
            >
              <p>卡片内容</p>
              <p>卡片内容</p>
              <p>卡片内容</p>
            </Card>
          </Col>
          <Col span={8}>
            <Card
              title="服务商排行榜"
              bordered={false}
              extra="更多"
            >
              <p>卡片内容</p>
              <p>卡片内容</p>
              <p>卡片内容</p>
            </Card>
          </Col>
        </Row>
        <h3 style={{ marginTop: 24 }}>快捷操作</h3>
        <Row style={{ marginTop: 24 }}>
          <Col span={8}>
            <Card bordered={false}>
              <img
                className={styles.floatLeft}
                alt="indicator"
                style={{ width: 56, height: 56 }}
                src="https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png"
              />
              <div className={styles.floatLeft}>
                <h3>政采云订单</h3>
                <p>查看从政采云同步的订单</p>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card bordered={false}>
              <img
                className={styles.floatLeft}
                alt="indicator"
                style={{ width: 56, height: 56 }}
                src="https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png"
              />
              <div className={styles.floatLeft}>
                <h3>区域经销商管理</h3>
                <p>维护区域经销商的基本信息</p>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card bordered={false}>
              <img
                className={styles.floatLeft}
                alt="indicator"
                style={{ width: 56, height: 56 }}
                src="https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png"
              />
              <div className={styles.floatLeft}>
                <h3>商品管理</h3>
                <p>维护商品的SPU和SKU信息</p>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect(state => ({
  user: state.user,
}))(Dashboard);
