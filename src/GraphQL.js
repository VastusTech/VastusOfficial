import { API, graphqlOperation} from 'aws-amplify';
import _ from 'lodash';

class GraphQL {
    static getClient(id, variableList, successHandler, failureHandler) {
        this.execute(this.constructQuery("GetClient", "getClient", {id: id}, variableList),
            "getClient", successHandler, failureHandler);
    }
    static getClientByUsername(username, variableList, successHandler, failureHandler) {
        this.execute(this.constructQuery("GetClientByUsername", "getClientByUsername", {username: username}, variableList),
            "getClientByUsername", successHandler, failureHandler);
    }
    static getParty(id, variableList, successHandler, failureHandler) {
        this.execute(this.constructQuery("GetParty", "getParty", {id: id}, variableList),
            "getParty", successHandler, failureHandler);
    }
    static getChallenge(id, variableList, successHandler, failureHandler) {
        this.execute(this.constructQuery("GetChallenge", "getChallenge", {id: id}, variableList),
            "getChallenge", successHandler, failureHandler);
    }
    // TODO Eventually make this work better to allow for more intelligent queries
    static queryChallenges(variableList, filter, limit, nextToken, successHandler, failureHandler) {
        this.execute(this.constructQuery("QueryChallenges", "queryChallenges", {}, variableList, filter, true),
            "queryChallenges", successHandler, failureHandler);
    }
    static queryClients(variableList, filter, limit, nextToken, successHandler, failureHandler) {
        var inputVariables = {};
        if (limit) {
            inputVariables.limit = limit;
        }
        if (nextToken) {
            inputVariables.nextToken = nextToken;
        }
        this.execute(this.constructQuery("QueryClients", "queryClients", inputVariables, variableList, filter, true),
            "queryClients", successHandler, failureHandler);
    }

    // TODO This function is going to be how to filter any query
    // cohestionOperator is "and" or "or", depending on how you want the filter to go (TODO include "not"?)
    // variableComparisons is object { variableName: comparisonFunction }
    //          comparisonFunction is in {ne,eq,le,lt,ge,gt,contains,notContains,between,beginsWith}
    // variableValues is object { variableName: variableValue }
    static generateFilter(cohesionOperator, variableComparisons, variableValues) {
        var parameterString = 'filter: {\n        ' + cohesionOperator + ': [\n';
        var parameters = {};
        for (let variableName in variableComparisons) {
            parameterString += '            {\n                ';
            parameterString += variableName + ': {\n';
            parameterString += '                    ';
            alert(variableComparisons.hasOwnProperty(variableName));
            const comparison = variableComparisons[variableName];
            const valueName = variableName + comparison;
            const value = variableValues[variableName];
            parameters[valueName] = value;
            parameterString += comparison + ': $' + valueName + '\n';
            parameterString += '                }\n            }\n';
        }
        parameterString += '        ]\n    }';
        return {
            parameterString: parameterString,
            parameters: parameters
        };
    }
    // TODO This only supports input String! types. Reason to change?
    static constructQuery(queryName, queryFunction, inputVariables, outputVariables, filter = null, ifList = false) {
        let query = '';
        var finalInputVariables;
        if (filter) {
            finalInputVariables = {...inputVariables, ...filter.parameters};
        }
        else {
            finalInputVariables = inputVariables;
        }
        var ifFirst = true;
        query += 'query ' + queryName;
        if (!_.isEmpty(finalInputVariables)) {
            query += '(';
            for (let variable in finalInputVariables) {
                if (!ifFirst) {
                    query += ", ";
                }
                query += '$' + variable + ': ';
                if (variable === "limit") {
                    query += 'Int';
                }
                else {
                    query += 'String!';
                }
                ifFirst = false;
            }
            query += ')';
        }
        query += ' {\n    ' + queryFunction;
        ifFirst = true;
        if (!_.isEmpty(inputVariables) || filter) {
            query += '(';
            if (filter) {
                query += filter.parameterString;
            }
            for (let variable in inputVariables) {
                if (!ifFirst || filter) {
                    query += ', ';
                }
                query += variable + ": $" + variable;
            }
            query += ')';
        }
        query += ' {\n';
        if (ifList) {
            query += '        items {\n';
        }
        for (let i in outputVariables) {
            if (ifList) {
                query += '    ';
            }
            query += '        ' + outputVariables[i] + '\n';
        }
        if (ifList) {
            query += '        }\n        nextToken\n';
        }
        query += '    }\n}';

        return {
            query: query,
            variables: finalInputVariables
        };
    }
    static async execute(query, queryFunctionName, successHandler, failureHandler) {
        alert("About to send to GraphQL: " + query.query);
        API.graphql(graphqlOperation(query.query, query.variables)).then((data) => {
            console.log("GraphQL operation succeeded!");
            if (!data.data || !data.data[queryFunctionName]) {
                console.log("Object returned nothing");
                failureHandler("Object had returned null");
            }
            successHandler(data.data[queryFunctionName]);
        }).catch((error) => {
            console.log("GraphQL operation failed...");
            failureHandler(error);
        });
    }
}

export default GraphQL;


