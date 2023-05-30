package models

import (
	"fmt"
	"os"
	"os/user"
	"path"

	"github.com/grafana/grafana-plugin-sdk-go/backend"
	jsoniter "github.com/json-iterator/go"

	"github.com/oracle/oci-grafana-metrics/pkg/plugin/constants"
)

// OCIDatasourceSettings holds the datasource configuration information for OCI
type OCIDatasourceSettings struct {
	AuthProvider         string `json:"authProvider"`
	ConfigPath           string `json:"configPath"`
	ConfigProfile        string `json:"configProfile"`
	TenancyMode          string `json:"TenancyMode"`
	MultiTenancyMode     string `json:"multiTenancyMode"`
	MultiTenancyFile     string `json:"multiTenancyFile"`
	TenancyName          string `json:"tenancyName,omitempty"`
	EnableCMDB           bool   `json:"enableCMDB"`
	EnableCMDBUploadFile bool   `json:"enableCMDBUploadFile"`
	Environment          string `json:"Environment"`

	Profile_0 string `json:"profile0,omitempty"`
	Region_0  string `json:"region0,omitempty"`

	Profile_1 string `json:"profile1,omitempty"`
	Region_1  string `json:"region1,omitempty"`

	Profile_2 string `json:"profile2,omitempty"`
	Region_2  string `json:"region2,omitempty"`

	Profile_3 string `json:"profile3,omitempty"`
	Region_3  string `json:"region3,omitempty"`

	Profile_4 string `json:"profile4,omitempty"`
	Region_4  string `json:"region4,omitempty"`

	Profile_5 string `json:"profile5,omitempty"`
	Region_5  string `json:"region5,omitempty"`
}

func (d *OCIDatasourceSettings) Load(dsiSettings backend.DataSourceInstanceSettings) error {
	var err error

	if dsiSettings.JSONData != nil && len(dsiSettings.JSONData) > 1 {
		if err = jsoniter.Unmarshal(dsiSettings.JSONData, d); err != nil {
			return fmt.Errorf("could not unmarshal OCIDatasourceSettings json: %w", err)
		}
	}

	if d.AuthProvider == constants.OCI_CLI_AUTH_PROVIDER {
		homeFolder := getHomeFolder()

		if d.ConfigPath == "" || d.ConfigPath == constants.DEFAULT_CONFIG_FILE {
			d.ConfigPath = path.Join(homeFolder, constants.DEFAULT_CONFIG_DIR_NAME, "config")
		}

		if d.ConfigProfile == "" {
			d.ConfigProfile = constants.DEFAULT_PROFILE
		}

		if d.TenancyName == "" {
			d.TenancyName = "root"
		}

		return nil
	}

	// in case of instance principle auth provider
	d.ConfigProfile = constants.DEFAULT_INSTANCE_PROFILE

	return nil
}

func getHomeFolder() string {
	current, e := user.Current()
	if e != nil {
		//Give up and try to return something sensible
		home := os.Getenv("HOME")
		if home == "" {
			home = os.Getenv("USERPROFILE")
		}
		return home
	}
	return current.HomeDir
}