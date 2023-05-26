/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Controlled as CodeMirror } from "react-codemirror2-react-17";
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material-darker.css';
import 'codemirror/theme/xq-light.css';
import 'codemirror';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/hint/show-hint';
import 'codemirror-graphql/lint';
import 'codemirror-graphql/hint';
import 'codemirror-graphql/mode';
import beautify from 'json-beautify';
 
const Settings = ({
  graphQLRoute,
  setGraphQLRoute,
  serverAddress,
  setServerAddress,
  redisRoute,
  setRedisRoute,
  schema,
  clearCacheRoute,
  setClearCacheRoute,
} = props) => {
  const [editorText, setEditorText] = useState(JSON.stringify(schema, null, 2));

  const inputArea = (_id:string, func, defaultVal) => {
    return (
      <div id={`${_id.toLowerCase().split(" ").join("_")}`}>
        {`${_id}`}
        <br />
        <input
          className="settingInputs"
          onChange={(e) => func(e.target.value)}
          value={`${defaultVal}`}
        />
      </div>
    );
  };

  return (
    <React.Fragment>
      <div className="settingsInput">
        <div className="title_bar">Basic Configuration</div>
        <form className="configSettings">
          {inputArea("GraphQL Route", setGraphQLRoute, graphQLRoute)}
          <div
            className="settingInputsDesc"
            style={graphQLRoute === "" ? { color: "red" } : {}}
          >
            {`${
              graphQLRoute === "" ? "*REQUIRED!* Please enter e" : "E"
            }ndpoint where GraphQL schema will be retrieved and queries sent.`}
          </div>
          {inputArea("Server Address", setServerAddress, serverAddress)}
          <div
            className="settingInputsDesc"
            style={serverAddress === "" ? { color: "red" } : {}}
          >
            {`${
              serverAddress === "" ? "*REQUIRED!* Please enter " : ""
            }HTTP address of server from which Quell makes GraphQL queries.`}
          </div>
          {inputArea("Redis Route", setRedisRoute, redisRoute)}
          <div
            className="settingInputsDesc"
            style={redisRoute === "" ? { color: "red" } : {}}
          >
            {`${
              redisRoute === "" ? "*REQUIRED!* Please enter e" : "E"
            }ndpoint where `}<code>QuellCache.getRedisInfo</code>{` middleware is configured.`}
          </div>
          {inputArea("Clear Cache Route", setClearCacheRoute, clearCacheRoute)}
          <div className="settingInputsDesc">
            <span>{`Endpoint where `}</span><code>QuellCache.clearCache</code><span>{` endpoint is configured.`}</span>
          </div>
        </form>
      </div>

      <div className="retrievedSchema" style={{marginLeft:'-3px'}}>
        <div className="title_bar">Retrieved GraphQL Schema</div>
        <CodeMirror
          className="schema_editor"
          value={editorText}
          options={{
            theme: "material-darker",
            mode: "json",
          }}
        />
      </div>
    </React.Fragment>
  );
};

export default Settings;
