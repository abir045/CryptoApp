import React, { useState } from "react";
import HTMLReactParser from "html-react-parser";
import { useParams } from "react-router-dom";
import millify from "millify";
import { Col, Row, Typography, Select } from "antd";
import {
  useGetCryptosDetailsQuery,
  useGetCryptoHistoryQuery,
} from "../services/cryptoApi";
import LineChart from "./LineChart";

import {
  MoneyCollectOutlined,
  DollarCircleOutlined,
  FundOutlined,
  ExclamationCircleOutlined,
  StopOutlined,
  TrophyOutlined,
  CheckOutlined,
  NumberOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

const CryptoDetails = () => {
  const { coinId } = useParams();
  const [timePeriod, setTimePeriod] = useState("24h");
  const { data, isFetching } = useGetCryptosDetailsQuery(coinId);
  const { data: coinHistory } = useGetCryptoHistoryQuery({
    coinId,
    timePeriod,
  });
  const CryptoDetails = data?.data?.coin;

  if (isFetching) return "loading...";

  console.log(coinHistory);

  const time = ["3h", "24h", "7d", "30d", "1y", "3m", "3y", "5y"];

  const stats = [
    {
      title: "Price to USD",
      value: `$ ${CryptoDetails?.price && millify(CryptoDetails?.price)}`,
      icon: <DollarCircleOutlined />,
    },
    {
      title: "Rank",
      value: CryptoDetails?.rank,
      icon: <NumberOutlined />,
    },
    {
      title: "24h Volume",
      value: `$ ${CryptoDetails?.volume && millify(CryptoDetails.volume)}`,
      icon: <ThunderboltOutlined />,
    },
    {
      title: "Market Cap",
      value: `$ ${
        CryptoDetails?.marketCap && millify(CryptoDetails.marketCap)
      }`,
      icon: <DollarCircleOutlined />,
    },
    {
      title: "All-time-high(daily avg.)",
      value: `$ ${
        CryptoDetails?.allTimeHigh?.price &&
        millify(CryptoDetails?.allTimeHigh?.price)
      }`,
      icon: <TrophyOutlined />,
    },
  ];

  const genericStats = [
    {
      title: "Number of Markets ",
      value: `${
        CryptoDetails?.numberOfMarkets &&
        millify(CryptoDetails?.numberOfMarkets)
      }`,
      icon: <FundOutlined />,
    },

    {
      title: "Number of Exchange",
      value: CryptoDetails?.numberOfExchanges,
      icon: <MoneyCollectOutlined />,
    },
    {
      title: "Approved Supply",
      value: CryptoDetails?.supply?.confirmed ? (
        <CheckOutlined />
      ) : (
        <StopOutlined />
      ),
      icon: <ExclamationCircleOutlined />,
    },

    {
      title: "Total Supply",
      value: `$ ${
        CryptoDetails?.supply?.total && millify(CryptoDetails?.supply?.total)
      }`,
      icon: <ExclamationCircleOutlined />,
    },
    {
      title: "Circulating Supply",
      value: `$ ${
        CryptoDetails?.supply?.circulating &&
        millify(CryptoDetails?.supply?.circulating)
      }`,
      icon: <ExclamationCircleOutlined />,
    },
  ];

  return (
    <>
      <Col className="coin-detail-container">
        <Col className="coin-heading-container">
          <Title level={2} className="coin-name">
            {CryptoDetails.name} ({CryptoDetails?.symbol}) Price
          </Title>
          <p>
            {CryptoDetails.name} live price in US dollars, view value
            statistics, market cap and supply.
          </p>
        </Col>

        <Select
          defaultValue="7d"
          className="select-timeperiod"
          onChange={(value) => setTimePeriod(value)}
        >
          {time.map((date) => (
            <Option key={date}>{date}</Option>
          ))}
        </Select>

        <LineChart
          coinHistory={coinHistory}
          currentPrice={millify(CryptoDetails.price)}
          coinName={CryptoDetails.name}
        />

        <Col className="stats-container">
          <Col className="coin-value-statistics">
            <Col className="coin-value-statisctics-heading">
              <Title level={3} className="coin-details-heading">
                {CryptoDetails.name} value statisctics
              </Title>
              <p>An overview showing the stats of {CryptoDetails.name} </p>
            </Col>
            {stats.map(({ icon, title, value, i }) => (
              <Col className="coin-stats">
                <Col className="coin-stats-name">
                  <Text key={i}>{icon}</Text>
                  <Text key={i}>{title}</Text>
                </Col>
                <Text key={i} className="stats">
                  {value}
                </Text>
              </Col>
            ))}
          </Col>

          <Col className="other-stats-info">
            <Col className="coin-value-statisctics-heading">
              <Title level={3} className="coin-details-heading">
                Other statisctics
              </Title>
              <p>An overview showing the other stats </p>
            </Col>
            {genericStats.map(({ icon, title, value, i }) => (
              <Col className="coin-stats">
                <Col className="coin-stats-name">
                  <Text key={i}>{icon}</Text>
                  <Text key={i}>{title}</Text>
                </Col>
                <Text className="stats" key={i}>
                  {value}
                </Text>
              </Col>
            ))}
          </Col>
        </Col>

        <Col className="coin-desc-link">
          <Row className="coin-desc">
            <Title level={3} className="coin-details-heading">
              What is {CryptoDetails.name}
              {HTMLReactParser(CryptoDetails.description)}
            </Title>
          </Row>
          <Col className="coin-links">
            <Title level={3} className="coin-details-heading">
              {CryptoDetails.name} Links
            </Title>
            {CryptoDetails.links.map((link) => (
              <Row className="coin-link" key={link.name}>
                <Title level={5} className="link-name">
                  {link.type}
                </Title>
                <a href={link.url}>{link.name}</a>
              </Row>
            ))}
          </Col>
        </Col>
      </Col>
    </>
  );
};

export default CryptoDetails;
