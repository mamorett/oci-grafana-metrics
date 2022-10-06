import { DataQueryResponse, DataQueryError, DataFrame, MetricFindValue, DataQuery } from '@grafana/data';
/**
 * Parse the results from /api/ds/query into a DataQueryResponse
 *
 * @param res - the HTTP response data.
 * @param queries - optional DataQuery array that will order the response based on the order of query refId's.
 *
 * @public
 */
export declare function toDataQueryResponse(res: any, queries?: DataQuery[]): DataQueryResponse;
/**
 * Convert an object into a DataQueryError -- if this is an HTTP response,
 * it will put the correct values in the error field
 *
 * @public
 */
export declare function toDataQueryError(err: any): DataQueryError;
/**
 * Return the first string or non-time field as the value
 *
 * @beta
 */
export declare function frameToMetricFindValue(frame: DataFrame): MetricFindValue[];
