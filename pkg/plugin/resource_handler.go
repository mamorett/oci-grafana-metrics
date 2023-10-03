/*
** Copyright © 2023 Oracle and/or its affiliates. All rights reserved.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

package plugin

import (
	"net/http"

	"github.com/grafana/grafana-plugin-sdk-go/backend"
	jsoniter "github.com/json-iterator/go"

	"github.com/oracle/oci-grafana-metrics/pkg/plugin/models"
)

type rootRequest struct {
	Tenancy string `json:"tenancy"`
}
type namespaceMetricRequest struct {
	Tenancy     string `json:"tenancy"`
	Compartment string `json:"compartment"`
	Region      string `json:"region"`
}
type resourceGroupRequest struct {
	Tenancy     string `json:"tenancy"`
	Compartment string `json:"compartment"`
	Region      string `json:"region"`
	Namespace   string `json:"namespace"`
}
type dimensionRequest struct {
	Tenancy     string `json:"tenancy"`
	Compartment string `json:"compartment"`
	Region      string `json:"region"`
	Namespace   string `json:"namespace"`
	MetricName  string `json:"metric_name"`
}
type tagRequest struct {
	Tenancy         string `json:"tenancy"`
	Compartment     string `json:"compartment"`
	CompartmentName string `json:"compartment_name"`
	Region          string `json:"region"`
	Namespace       string `json:"namespace"`
}

func (ocidx *OCIDatasource) registerRoutes(mux *http.ServeMux) {
	mux.HandleFunc("/tenancies", ocidx.GetTenanciesHandler)
	mux.HandleFunc("/regions", ocidx.GetRegionsHandler)
	mux.HandleFunc("/compartments", ocidx.GetCompartmentsHandler)
	mux.HandleFunc("/namespaces", ocidx.GetNamespacesHandler)
	mux.HandleFunc("/resourcegroups", ocidx.GetResourceGroupHandler)
	mux.HandleFunc("/dimensions", ocidx.GetDimensionsHandler)
	mux.HandleFunc("/tags", ocidx.GetTagsHandler)
}

func (ocidx *OCIDatasource) GetTenanciesHandler(rw http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodGet {
		respondWithError(rw, http.StatusMethodNotAllowed, "Invalid method", nil)
		return
	}

	// ts := ocidx.clients.GetTenancies(req.Context())
	ts := ocidx.GetTenancies(req.Context())

	writeResponse(rw, ts)
}

func (ocidx *OCIDatasource) GetRegionsHandler(rw http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodPost {
		respondWithError(rw, http.StatusMethodNotAllowed, "Invalid method", nil)
		return
	}

	var rr rootRequest
	if err := jsoniter.NewDecoder(req.Body).Decode(&rr); err != nil {
		backend.Logger.Error("plugin.resource_handler", "GetRegionsHandler", err)
		respondWithError(rw, http.StatusBadRequest, "Failed to read request body", err)
		return
	}
	regions := ocidx.GetSubscribedRegions(req.Context(), rr.Tenancy)
	if regions == nil {
		backend.Logger.Error("plugin.resource_handler", "GetSubscribedRegions", "Could not read regions")
		respondWithError(rw, http.StatusBadRequest, "Could not read regions", nil)
		return
	}

	writeResponse(rw, regions)
}

func (ocidx *OCIDatasource) GetCompartmentsHandler(rw http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodPost {
		respondWithError(rw, http.StatusMethodNotAllowed, "Invalid method", nil)
		return
	}

	var rr rootRequest
	if err := jsoniter.NewDecoder(req.Body).Decode(&rr); err != nil {
		backend.Logger.Error("plugin.resource_handler", "GetCompartmentsHandler", err)
		respondWithError(rw, http.StatusBadRequest, "Failed to read request body", err)
		return
	}
	compartments := ocidx.GetCompartments(req.Context(), rr.Tenancy)
	if compartments == nil {
		backend.Logger.Error("plugin.resource_handler", "GetCompartmentsHandler", "Could not read compartments")
		respondWithError(rw, http.StatusBadRequest, "Could not read compartments", nil)
		return
	}

	writeResponse(rw, compartments)
}

func (ocidx *OCIDatasource) GetNamespacesHandler(rw http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodPost {
		respondWithError(rw, http.StatusMethodNotAllowed, "Invalid method", nil)
		return
	}

	var nmr namespaceMetricRequest
	if err := jsoniter.NewDecoder(req.Body).Decode(&nmr); err != nil {
		backend.Logger.Error("plugin.resource_handler", "GetNamespacesHandler", err)
		respondWithError(rw, http.StatusBadRequest, "Failed to read request body", err)
		return
	}

	namespaces := ocidx.GetNamespaceWithMetricNames(req.Context(), nmr.Tenancy, nmr.Compartment, nmr.Region)

	writeResponse(rw, namespaces)
}

func (ocidx *OCIDatasource) GetResourceGroupHandler(rw http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodPost {
		respondWithError(rw, http.StatusMethodNotAllowed, "Invalid method", nil)
		return
	}

	var rgr resourceGroupRequest
	if err := jsoniter.NewDecoder(req.Body).Decode(&rgr); err != nil {
		backend.Logger.Error("plugin.resource_handler", "GetResourceGroupHandler", err)
		respondWithError(rw, http.StatusBadRequest, "Failed to read request body", err)
		return
	}

	rgs := ocidx.GetResourceGroups(req.Context(), rgr.Tenancy, rgr.Compartment, rgr.Region, rgr.Namespace)

	writeResponse(rw, rgs)
}

func (ocidx *OCIDatasource) GetDimensionsHandler(rw http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodPost {
		respondWithError(rw, http.StatusMethodNotAllowed, "Invalid method", nil)
		return
	}

	var dr dimensionRequest
	if err := jsoniter.NewDecoder(req.Body).Decode(&dr); err != nil {
		backend.Logger.Error("plugin.resource_handler", "GetDimensionsHandler", err)
		respondWithError(rw, http.StatusBadRequest, "Failed to read request body", err)
		return
	}

	dimensions := ocidx.GetDimensions(req.Context(), dr.Tenancy, dr.Compartment, dr.Region, dr.Namespace, dr.MetricName)

	writeResponse(rw, dimensions)
}

func (ocidx *OCIDatasource) GetTagsHandler(rw http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodPost {
		respondWithError(rw, http.StatusMethodNotAllowed, "Invalid method", nil)
		return
	}

	var tr tagRequest
	if err := jsoniter.NewDecoder(req.Body).Decode(&tr); err != nil {
		backend.Logger.Error("ResourceHandler", "GetTagsHandler", err)
		respondWithError(rw, http.StatusBadRequest, "Failed to read request body", err)
		return
	}

	tags := ocidx.GetTags(req.Context(), tr.Tenancy, tr.Compartment, tr.CompartmentName, tr.Region, tr.Namespace)

	writeResponse(rw, tags)
}

func writeResponse(rw http.ResponseWriter, resp interface{}) {
	resultJson, err := jsoniter.Marshal(resp)
	if err != nil {
		backend.Logger.Error("plugin.resource_handler", "writeResponse", "could not parse response:"+err.Error())
		respondWithError(rw, http.StatusInternalServerError, "Failed to convert result", err)
	}

	sendResponse(rw, http.StatusOK, resultJson)
}

func respondWithError(rw http.ResponseWriter, statusCode int, message string, err error) {
	httpError := &models.HttpError{
		Message:    message,
		StatusCode: statusCode,
	}
	if err != nil {
		httpError.Error = err.Error()
	}

	response, err := jsoniter.Marshal(httpError)
	if err != nil {
		backend.Logger.Error("plugin.resource_handler", "respondWithError", "could not parse response:"+err.Error())
		rw.WriteHeader(http.StatusInternalServerError)
		return
	}

	sendResponse(rw, statusCode, response)
}

func sendResponse(rw http.ResponseWriter, statusCode int, response []byte) {
	rw.Header().Set("Content-Type", "application/json")
	rw.WriteHeader(statusCode)

	_, err := rw.Write(response)
	if err != nil {
		backend.Logger.Error("plugin.resource_handler", "sendResponse", "could not write to response: "+err.Error())
		rw.WriteHeader(http.StatusInternalServerError)
	}
}
