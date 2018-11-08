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
    static getTrainer(id, variableList, successHandler, failureHandler) {
        this.execute(this.constructQuery("GetTrainer", "getTrainer", {id: id}, variableList),
            "getTrainer", successHandler, failureHandler);
    }
    static getTrainerByUsername(username, variableList, successHandler, failureHandler) {
        this.execute(this.constructQuery("GetTrainerByUsername", "getTrainerByUsername", {username: username}, variableList),
            "getTrainerByUsername", successHandler, failureHandler);
    }
    static getGym(id, variableList, successHandler, failureHandler) {
        this.execute(this.constructQuery("GetGym", "getGym", {id: id}, variableList),
            "getGym", successHandler, failureHandler);
    }
    static getGymByUsername(username, variableList, successHandler, failureHandler) {
        this.execute(this.constructQuery("GetGymByUsername", "getGymByUsername", {username: username}, variableList),
            "getGymByUsername", successHandler, failureHandler);
    }
    static getWorkout(id, variableList, successHandler, failureHandler) {
        this.execute(this.constructQuery("GetWorkout", "getWorkout", {id: id}, variableList),
            "getWorkout", successHandler, failureHandler);
    }
    static getReview(id, variableList, successHandler, failureHandler) {
        this.execute(this.constructQuery("GetReview", "getReview", {id: id}, variableList),
            "getReview", successHandler, failureHandler);
    }
    /*
    static getParty(id, variableList, successHandler, failureHandler) {
        this.execute(this.constructQuery("GetParty", "getParty", {id: id}, variableList),
            "getParty", successHandler, failureHandler);
    }
    static getChallenge(id, variableList, successHandler, failureHandler) {
        this.execute(this.constructQuery("GetChallenge", "getChallenge", {id: id}, variableList),
            "getChallenge", successHandler, failureHandler);
    }
    */
    static getEvent(id, variableList, successHandler, failureHandler) {
        this.execute(this.constructQuery("GetEvent", "getEvent", {id: id}, variableList),
            "getEvent", successHandler, failureHandler);
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
    static queryTrainers(variableList, filter, limit, nextToken, successHandler, failureHandler) {
        var inputVariables = {};
        if (limit) {
            inputVariables.limit = limit;
        }
        if (nextToken) {
            inputVariables.nextToken = nextToken;
        }
        this.execute(this.constructQuery("QueryTrainers", "queryTrainers", inputVariables, variableList, filter, true),
            "queryTrainers", successHandler, failureHandler);
    }
    static queryGyms(variableList, filter, limit, nextToken, successHandler, failureHandler) {
        var inputVariables = {};
        if (limit) {
            inputVariables.limit = limit;
        }
        if (nextToken) {
            inputVariables.nextToken = nextToken;
        }
        this.execute(this.constructQuery("QueryGyms", "queryGyms", inputVariables, variableList, filter, true),
            "queryGyms", successHandler, failureHandler);
    }
    static queryWorkouts(variableList, filter, limit, nextToken, successHandler, failureHandler) {
        var inputVariables = {};
        if (limit) {
            inputVariables.limit = limit;
        }
        if (nextToken) {
            inputVariables.nextToken = nextToken;
        }
        this.execute(this.constructQuery("QueryWorkouts", "queryWorkouts", inputVariables, variableList, filter, true),
            "queryWorkouts", successHandler, failureHandler);
    }
    static queryReviews(variableList, filter, limit, nextToken, successHandler, failureHandler) {
        var inputVariables = {};
        if (limit) {
            inputVariables.limit = limit;
        }
        if (nextToken) {
            inputVariables.nextToken = nextToken;
        }
        this.execute(this.constructQuery("QueryReviews", "queryReviews", inputVariables, variableList, filter, true),
            "queryReviews", successHandler, failureHandler);
    }
    /*
    static queryParties(variableList, filter, limit, nextToken, successHandler, failureHandler) {
        var inputVariables = {};
        if (limit) {
            inputVariables.limit = limit;
        }
        if (nextToken) {
            inputVariables.nextToken = nextToken;
        }
        this.execute(this.constructQuery("QueryParties", "queryParties", inputVariables, variableList, filter, true),
            "queryParties", successHandler, failureHandler);
    }
    */
    static queryEvents(variableList, filter, limit, nextToken, successHandler, failureHandler) {
        var inputVariables = {};
        if (limit) {
            inputVariables.limit = limit;
        }
        if (nextToken) {
            inputVariables.nextToken = nextToken;
        }
        this.execute(this.constructQuery("QueryEvents", "queryEventss", inputVariables, variableList, filter, true),
            "queryEvents", successHandler, failureHandler);
    }

    // TODO Eventually make this work better to allow for more intelligent queries
    // TODO This function is going to be how to filter any query
    // TODO include "not"? Also should we make it more flexible so like and { not { or ...
    /**
     * This is to construct a filter object that we can put into any queryObjects function
     * @param cohesionOperator Either "and" or "or", depending on how we want to mix the operation
     * @param variableComparisons The object that determines how we compare the variable { variableName: comparisonFunction }
     *    The comparison function is string in {"ne","eq","le","lt","ge","gt","contains","notContains","between","beginsWith"}
     * @param variableValues The object that determines what value we compare the variable with { variableName: variableValue }
     * @returns {{parameterString: string, parameters: parameters}}
     */
    static generateFilter(cohesionOperator, variableComparisons, variableValues) {
        var parameterString = 'filter: {\n        ' + cohesionOperator + ': [\n';
        var parameters = {};
        for (let variableName in variableComparisons) {
            parameterString += '            {\n                ';
            parameterString += variableName + ': {\n';
            parameterString += '                    ';
            // alert(variableComparisons.hasOwnProperty(variableName));
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
        API.graphql(graphqlOperation(query.query, query.variables)).then((data) => {
            console.log("GraphQL operation succeeded!");
            if (!data.data || !data.data[queryFunctionName]) {
                console.log("Object returned nothing");
                failureHandler("Object had returned null");
            }
            successHandler(data.data[queryFunctionName]);
        }).catch((error) => {
            console.log("GraphQL operation failed...");
            if (error.message) {
                error = error.message;
            }
            alert(JSON.stringify(error));
            failureHandler(error);
        });
    }
}

export default GraphQL;


