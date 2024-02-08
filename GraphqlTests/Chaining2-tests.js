import { expect } from 'chai';
import axios from 'axios';
import fs from 'fs/promises';
import dotenv from 'dotenv';
// import faker from 'faker';
import 'mocha-junit-reporter';

dotenv.config();

describe('GraphQL FUNCTIONS API CRUD Tests', () => {
  let retrievedFunctionId;
  let authorizationHeader;
  let graphqlEndpoint;

  beforeEach(() => {
    authorizationHeader = {
      'Authorization': `eyJraWQiOiJJTjhraElkamVvQjhUR1NrMnk1UWhtNE5SWkJNLWpLLWhOWWpsVzNqa19BIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULjlqUHl1Y0xpT0YyZEx2bDJUM2VBUGhMdTJFSGd4c1l2WnVlb1hFZnBjT3cub2FyMjA0OW5tbDh2M0gzSkMyOTciLCJpc3MiOiJodHRwczovL2VtbWVzLm9rdGEuY29tL29hdXRoMi9kZWZhdWx0IiwiYXVkIjoiYXBpOi8vZGVmYXVsdCIsImlhdCI6MTcwNTg5OTI1OCwiZXhwIjoxNzA1OTAyODU4LCJjaWQiOiIwb2EydTkxbnY2a0ROaXdLdTI5NyIsInVpZCI6IjAwdWt4ZGpsN2drck9MVVJUMjk3Iiwic2NwIjpbIm9mZmxpbmVfYWNjZXNzIiwicHJvZmlsZSIsImVtYWlsIiwib3BlbmlkIl0sImF1dGhfdGltZSI6MTcwNTg5OTE4Nywic3ViIjoiZS5zcmlrYW50aEBlbW1lcy5jb20ifQ.Hj7OVsLfS4evdY5UdDhc-je1zeOAYXmvMrzXs6-RqdVln_PB6odfFetEtERjKzfKy1-AXUN_7kGEKe79iLOWYxlM48aXjvTWTZILgTWSPzDhiqFuNOt3eQy8vGlcUffxghA1DVGZmjVsVzCuFmqoH1ybsgGTNGpHLavUI8wZjSm98GH0tMefR0U-VVW0hb6iyksP4gcpg8MMGmEYwkXkFkkeA2c2uBfQjjW5A0dTdm5l5_oW5eIA5IWv59GG5VLDo9E8_GG_Td_K09LtclY3-3x2TtQmos5HNLvNmExlAICWBoaJxQYGjYsIijB8BpQn3rcVjFDYv1HGL2rEMg3mXg`, // Replace with your actual authorization token
      'Content-Type': 'application/json',
    };
    graphqlEndpoint = "https://dev-sb-api.advantage-eclinical.com/studyBuilder";
  });
  //-----------------------------------------Create Function------------------------------------------------------------
  it('should create a resource', async () => {
    const queryPath = 'C:/Users/srika/AsbApiAutomation/Graphql_queries/Functions/CreateFunction.graphql';
    const query = await fs.readFile(queryPath, 'utf8');
    const variablesPath = 'C:/Users/srika/AsbApiAutomation/Graphql_variables/Functions_var/CreateFunction.json';
    const variables = JSON.parse(await fs.readFile(variablesPath, 'utf8'));
    // const {faker}=require("@faker-js/faker");
    // variables.name = faker.name.findName(); 

    try {
      const createResponse = await axios.post(
        graphqlEndpoint,
        { query, variables },
        {
          headers: authorizationHeader
        }
      );
      console.log(createResponse);
      console.log(JSON.stringify(createResponse.data, null, 2));
      expect(createResponse.status).to.equal(200);

    } catch (error) {
      console.error('GraphQL Error:', error.message);
      console.log('GraphQL Response Data:', JSON.stringify(error.response?.data, null, 2));
      throw error;
    }
  });

  //------------------------------------Retrieve Function-------------------------------------------------------------------------------------
  it('should retrieve the created resource', async () => {
    const queryPath = 'C:/Users/srika/AsbApiAutomation/Graphql_queries/Functions/GetFunction.graphql';
    const query = await fs.readFile(queryPath, 'utf8');
    const variablesPath = 'C:/Users/srika/AsbApiAutomation/Graphql_variables/Functions_var/GetFunction.json';
    const variables = JSON.parse(await fs.readFile(variablesPath, 'utf8'));
    try {
      const retrieveResponse = await axios.post(
        graphqlEndpoint,
        { query, variables },

        {
          headers: authorizationHeader
        }

      );

      expect(retrieveResponse.status).to.equal(200);
      expect(retrieveResponse.data).to.have.property('data');
      const functions = retrieveResponse.data.data.functions;
      expect(functions).to.be.an('array');
      expect(functions).to.have.length.greaterThan(0);
      const targetFunctionName = '12745';
      const targetFunction = functions.find(func => func.name === targetFunctionName);
      expect(targetFunction, `Function with name '${targetFunctionName}' not found`).to.not.be.undefined;
      retrievedFunctionId = targetFunction.functionid;
      console.log(`Function ID for ${targetFunctionName}:`, retrievedFunctionId);
    } catch (error) {
      console.error('GraphQL Error:', error.message);
      console.log('GraphQL Response Data:', JSON.stringify(error.response?.data, null, 2));
      throw error;
    }
  });
  //------------------------------------Update Function-------------------------------------------------------------------------------
  it('should update the created resource', async () => {
    const queryPath = 'C:/Users/srika/AsbApiAutomation/Graphql_queries/Functions/UpdateFunction.graphql';
    const query = await fs.readFile(queryPath, 'utf8');
    const variablesPath = 'C:/Users/srika/AsbApiAutomation/Graphql_variables/Functions_var/UpdateFunction.json';
    const updateVariables = JSON.parse(await fs.readFile(variablesPath, 'utf8'));
    updateVariables.functionid = retrievedFunctionId;

    try {
      const updateResponse = await axios.post(
        graphqlEndpoint,
        { query, variables: updateVariables },
        {
          headers: authorizationHeader
        }
      );
      expect(updateResponse.status).to.equal(200);
    } catch (error) {
      console.error('GraphQL Error:', error.message);
      console.log('GraphQL Response Data:', JSON.stringify(error.response?.data, null, 2));
      throw error;
    }
  });
  //-----------------------------------------Delete Function-------------------------------------------------------------------------
  it('should delete the created resource', async () => {
    const queryPath = 'C:/Users/srika/AsbApiAutomation/Graphql_queries/Functions/DeleteFunction.graphql';
    const query = await fs.readFile(queryPath, 'utf8');
    const variablesPath = 'C:/Users/srika/AsbApiAutomation/Graphql_variables/Functions_var/DeleteFunction.json';
    const deleteVariables = JSON.parse(await fs.readFile(variablesPath, 'utf8'));
    deleteVariables.functionid = retrievedFunctionId;
    try {
      const deleteResponse = await axios.post(
        graphqlEndpoint,
        { query, variables: deleteVariables },
        {
          headers: authorizationHeader
        }
      );
      expect(deleteResponse.status).to.equal(200);
    } catch (error) {
      console.error('GraphQL Error:', error.message);
      console.log('GraphQL Response Data:', JSON.stringify(error.response?.data, null, 2));
      throw error;
    }
  });
});