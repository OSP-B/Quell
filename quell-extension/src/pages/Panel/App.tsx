/* eslint-disable react/react-in-jsx-scope */
import { useState, useEffect } from 'react';
import PrimaryNavBar from './Components/PrimaryNavBar';
import ServerTab from './Components/ServerTab';
import CacheTab from './Components/CacheTab';
import ClientTab from './Components/ClientTab';
import isGQLQuery from './helpers/isGQLQuery';
import { handleNavigate, handleRequestFinished } from './helpers/listeners';

// GraphQL
import { getIntrospectionQuery, buildClientSchema } from "graphql";
import Settings from "./Components/Settings";

// Sample clientRequest data for building Network component
import data from "./data/sampleClientRequests";
import { ClientRequest } from './interfaces/ClientRequest';
// import { IgnorePlugin } from "webpack";

const App = () => {
  // sets active tab - default: 'client'
  // other options - 'server', 'cache', 'settings'
  const [activeTab, setActiveTab] = useState<string>("client");

  // queried data results
  const [results, setResults] = useState({});
  const [schema, setSchema] = useState({});
  const [queryString, setQueryString] = useState<string>("");
  const [queryTimes, setQueryTimes] = useState([]);
  const [clientRequests, setClientRequests] = useState<ClientRequest[]>([]);

  // various routes to get information
  const [graphQLRoute, setGraphQLRoute] = useState<string>("/graphQL");
  const [clientAddress, setClientAddress] = useState<string>(
    "http://localhost:8080"
  );
  const [serverAddress, setServerAddress] = useState<string>(
    "http://localhost:3000"
  );
  const [redisRoute, setRedisRoute] = useState<string>("/redis");
  const [clearCacheRoute, setClearCacheRoute] = useState<string>("/clearCache");

  // function to clear front end cache
  const handleClearCache = (): void => {
    const address = `${serverAddress}${clearCacheRoute}`;
    fetch(address)
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  };

  // function used to listen to network requests and return any graphQL/Quell queries to populate client page
  const gqlListener = (request: ClientRequest): void => {
    if (isGQLQuery(request)) {
      request.getContent((body) => {
        const responseData = JSON.parse(body);
        request.responseData = responseData;
        setClientRequests((prev) => prev.concat([request]));
      });
    }
  };

  // function to listen to network requests and add query times to state
  const timeListener = (request: ClientRequest): void => {
    // if request was sent to the /api/queryTime route, add response body to queryTimes state
    request.getContent((body) => {
      const responseData = JSON.parse(body);
      if (responseData.time) {
        setQueryTimes((prev) => prev.concat([responseData.time]));
      }
    });
  };
  
  // COMMENT OUT IF WORKING FROM DEV SERVER
  useEffect(() => {
    handleRequestFinished(gqlListener);
    handleNavigate(gqlListener);

    handleRequestFinished(timeListener);
    handleNavigate(timeListener);
  }, []);

  useEffect(() => {
    const introspectionQuery = getIntrospectionQuery();
    const address = `${serverAddress}${graphQLRoute}`;
    fetch(address, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: introspectionQuery,
        operationName: "IntrospectionQuery",
        variables: null,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const schema = buildClientSchema(data.data);
        setSchema(schema || 'No schema retreived');
        console.log("schema: ",schema);
        console.log("data: ", data );

      })
      .catch((err) => console.log(err));
  }, [clientAddress, serverAddress, graphQLRoute]);

  // generates the page
  return (
    <div className="devtools">
      <PrimaryNavBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        graphQL_field={graphQLRoute !== ""}
        server_field={serverAddress !== ""}
        redis_field={redisRoute !== ""}
      />

      <div className="extensionTabs">
        {activeTab === "client" && (
          <ClientTab
            graphQLRoute={graphQLRoute}
            clientAddress={clientAddress}
            clientRequests={clientRequests} //change the props to 'data' for testing purposes
            queryTimes={queryTimes}
          />
        )}

        {activeTab === "server" && (
          <>
            <div className="title_bar">Query Quell Server</div>
            <ServerTab
              clientAddress={clientAddress}
              serverAddress={serverAddress}
              graphQLRoute={graphQLRoute}
              queryString={queryString}
              setQueryString={setQueryString}
              setResults={setResults}
              schema={schema}
              clearCacheRoute={clearCacheRoute}
              results={results}
              handleClearCache={handleClearCache}
            />
          </>
        )}

        {activeTab === "cache" && (
          <div className="cacheTab">
            <CacheTab
              serverAddress={serverAddress}
              redisRoute={redisRoute}
              handleClearCache={handleClearCache}
            />
          </div>
        )}

        {activeTab === "settings" && (
          <div className="settingsTab">
            <Settings
              graphQLRoute={graphQLRoute}
              setGraphQLRoute={setGraphQLRoute}
              serverAddress={serverAddress}
              setServerAddress={setServerAddress}
              redisRoute={redisRoute}
              schema={schema}
              setRedisRoute={setRedisRoute}
              clearCacheRoute={clearCacheRoute}
              setClearCacheRoute={setClearCacheRoute}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
