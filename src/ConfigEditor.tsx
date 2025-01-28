/*
** Copyright © 2023 Oracle and/or its affiliates. All rights reserved.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
*/

import React, { PureComponent } from 'react';
import { Input, Select, InlineField, FieldSet, InlineSwitch, TextArea } from '@grafana/ui';
import {
  DataSourcePluginOptionsEditorProps,
  onUpdateDatasourceJsonDataOptionSelect,
  onUpdateDatasourceJsonDataOption,
  onUpdateDatasourceJsonDataOptionChecked,
  onUpdateDatasourceSecureJsonDataOption,
  SelectableValue,
} from '@grafana/data';
import { OCIDataSourceOptions } from './types';
import {
  AuthProviders,
  TenancyChoices,
  AuthProviderOptions,
  TenancyChoiceOptions,
} from './config.options';
import {
  regions,
} from './regionlist';

interface Props extends DataSourcePluginOptionsEditorProps<OCIDataSourceOptions> {
  onUpdateDatasourceJsonDataOptionSelect: (props: Props, field: string) => (option: SelectableValue<string>) => void;
}

interface State {
  dynamicRegion0: string[];
  dynamicRegion1: string[];
  dynamicRegion2: string[];
  dynamicRegion3: string[];
  dynamicRegion4: string[];
  dynamicRegion5: string[];
}

export class ConfigEditor extends PureComponent<Props, State> {
    // Initialize state with a default empty value
    state: State = {
      dynamicRegion0: [
        ...regions,
        ...(this.props.options.jsonData.region0
          ? [this.props.options.jsonData.region0]
          : []),
      ], // Merge static regions and custom region0
      dynamicRegion1: [
        ...regions,
        ...(this.props.options.jsonData.region1
          ? [this.props.options.jsonData.region1]
          : []),
      ], // Merge static regions and custom region1
      dynamicRegion2: [
        ...regions,
        ...(this.props.options.jsonData.region2
          ? [this.props.options.jsonData.region2]
          : []),
      ], // Merge static regions and custom region2
      dynamicRegion3: [
        ...regions,
        ...(this.props.options.jsonData.region3
          ? [this.props.options.jsonData.region3]
          : []),
      ], // Merge static regions and custom region3
      dynamicRegion4: [
        ...regions,
        ...(this.props.options.jsonData.region4
          ? [this.props.options.jsonData.region4]
          : []),
      ], // Merge static regions and custom region4
      dynamicRegion5: [
        ...regions,
        ...(this.props.options.jsonData.region5
          ? [this.props.options.jsonData.region5]
          : []),
      ], // Merge static regions and custom region5
    };

    componentDidMount() {
      const { options, onOptionsChange } = this.props;
      const { jsonData } = options;
  
      if (!jsonData.profile0) {
        onOptionsChange({
          ...options,
          jsonData: {
            ...jsonData,
            profile0: "DEFAULT",
          },
        });
      }
    }  
  
  
  render() {
    const { options } = this.props;

    return (
      <FieldSet label="Connection Details">
        <InlineField
          label="Authentication Provider"
          labelWidth={28}
          tooltip="Specify which OCI credentials chain to use"
        >
          <Select
            className="width-30"
            value={options.jsonData.environment || ''}
            options={AuthProviderOptions}
            defaultValue={options.jsonData.environment}
            onChange={(option) => {
              onUpdateDatasourceJsonDataOptionSelect(this.props, 'environment')(option);
            }}
          />
        </InlineField>
        {options.jsonData.environment === AuthProviders.OCI_INSTANCE  && (
              <>
      <InlineField
          label="Cross Tenancy ocid (optional)"
          labelWidth={28}
          tooltip="AssumeRole compliant Cross Tenancy configuration. Do not use if you are not using Cross Tenancy configuration"
        >
        <Input
          className="width-30"
          value={options.jsonData.xtenancy0}
          onChange={onUpdateDatasourceJsonDataOption(this.props, 'xtenancy0')}
        />
      </InlineField>
            </>
        )}

{/**
 * --------------------------------------------------------------------------
 *                          User Principals
 * --------------------------------------------------------------------------
 */}   

      {options.jsonData.environment === AuthProviders.OCI_USER  && (
              <>
        <InlineField              
              label="Tenancy Mode"
              labelWidth={28}
              tooltip="Choose if want to enable multi-tenancy mode to fetch metrics accross multiple OCI tenancies"
            >
              <Select
                className="width-30"
                value={options.jsonData.tenancymode || ''}
                options={TenancyChoiceOptions}
                defaultValue={options.jsonData.tenancymode}
                onChange={(option) => {
                  onUpdateDatasourceJsonDataOptionSelect(this.props, 'tenancymode')(option);
                }}
              />
            </InlineField>
            </>
        )}        
            <br></br>

{/**
 * --------------------------------------------------------------------------
 *                          DEFAULT Tenancy
 * --------------------------------------------------------------------------
 */}

{/* User Principals - Default tenancy */}
  {options.jsonData.environment === AuthProviders.OCI_USER && (
      <FieldSet label="DEFAULT Connection Details">

      <InlineField
          label="Config Profile Name"
          labelWidth={28}
          tooltip="Config profile name. Default value is DEFAULT."
        >
        <Input
          className="width-30"
          readOnly
          value={options.jsonData.profile0}
        />
      </InlineField>
      <InlineField
          label="Dedicated Region"
          labelWidth={28}
          tooltip="Configure Dedicated Region YES/NO (default: NO)"
        >
          <InlineSwitch
            className="width-30"
            defaultChecked={options.jsonData && options.jsonData.customregionbool0 ? options.jsonData.customregionbool0 : false}
            onChange={onUpdateDatasourceJsonDataOptionChecked(this.props, 'customregionbool0')}
          />
        </InlineField>
        </FieldSet>    
      )}

  {/* Custom Region 0 */}
  {options.jsonData.environment === AuthProviders.OCI_USER && options.jsonData?.customregionbool0 && (
  <>
    <InlineField
            label="Region"
            labelWidth={28}
            tooltip="Custom Region"
          >
            <Input
              className="width-30"
              defaultValue={options.jsonData.customregion0}
              onChange={onUpdateDatasourceJsonDataOption(this.props, 'customregion0')}
            />
    </InlineField>
    
    <InlineField
      label="Domain"
      labelWidth={28}
      tooltip="Custom Domain"
    >
      <Input
        placeholder={options.secureJsonFields.customdomain0 ? 'configured' : ''}
        className="width-30"
        onChange={onUpdateDatasourceSecureJsonDataOption(this.props, 'customdomain0')}
      />
    </InlineField>
  </>
  )}

  {/* Commercial Region 0 */}
  {options.jsonData.environment === AuthProviders.OCI_USER && !options.jsonData?.customregionbool0 && (
  <>
      <InlineField
          label="Region"
          labelWidth={28}
          tooltip="Specify the Region"
        >
          <Select
            className="width-30"
            value={
              this.props.options.jsonData.region0
                ? { label: this.props.options.jsonData.region0, value: this.props.options.jsonData.region0 }
                : undefined
            }
            allowCustomValue
            onCreateOption={(customRegion0) => {
              const newOption: SelectableValue<string> = {
                label: customRegion0,
                value: customRegion0,
              };
              // Update regions array to include the new option
              this.setState((prevState) => ({
                dynamicRegion0: [...prevState.dynamicRegion0, customRegion0],
              }));                    
              onUpdateDatasourceJsonDataOptionSelect(this.props, 'region0')(newOption);
            }}
            options={this.state.dynamicRegion0.map((region) => ({
              label: region,
              value: region,
            }))}
            defaultValue={
              this.props.options.jsonData.region0
                ? { label: this.props.options.jsonData.region0, value: this.props.options.jsonData.region0 }
                : undefined
            }
            onChange={(option) => {
              onUpdateDatasourceJsonDataOptionSelect(this.props, 'region0')(option);
            }}
          />
        </InlineField>
        </>
      )}
  {/* DEFAULT Conf */}
  {options.jsonData.environment === AuthProviders.OCI_USER && (
  <>          
        <InlineField
              label="User OCID"
              labelWidth={28}
              tooltip="User OCID"
            >
              <Input
                className="width-30"
                placeholder={options.secureJsonFields.user0 ? 'configured' : ''}
                onChange={onUpdateDatasourceSecureJsonDataOption(this.props, 'user0')}
                />
      </InlineField>
      <InlineField
              label="Tenancy OCID"
              labelWidth={28}
              tooltip="Tenancy OCID"
            >
              <Input
                className="width-30"
                placeholder={options.secureJsonFields.tenancy0 ? 'configured' : ''}
                onChange={onUpdateDatasourceSecureJsonDataOption(this.props, 'tenancy0')}
                />
      </InlineField>
      <InlineField
              label="Fingerprint"
              labelWidth={28}
              tooltip="Fingerprint"
            >
              <Input
                placeholder={options.secureJsonFields.fingerprint0 ? 'configured' : ''}
                className="width-30"
                onChange={onUpdateDatasourceSecureJsonDataOption(this.props, 'fingerprint0')}
                />
      </InlineField>
      <InlineField
              label="Private Key"
              labelWidth={28}
              tooltip="Private Key"
            >
              <TextArea
                type="text"
                className="width-30"
                placeholder={options.secureJsonFields.privkey0 ? 'configured' : ''}
                cols={20}
                rows={4}
                maxLength={4096}
                onChange={onUpdateDatasourceSecureJsonDataOption(this.props, 'privkey0')}
                />
      </InlineField>       
      {/* </FieldSet>     */}
      </>
      )}


{/**
 * --------------------------------------------------------------------------
 *                          Multitenancy 1
 * --------------------------------------------------------------------------
 */}

{/* User Principals - Multitenancy Tenancy 1*/}
<br/>
        {options.jsonData.tenancymode === TenancyChoices.multitenancy && options.jsonData.environment === AuthProviders.OCI_USER && (
      <FieldSet label="Tenancy-1 Connection Details">
      <InlineField
              label="Config Profile Name"
              labelWidth={28}
              tooltip="Config profile name. Default value is DEFAULT."
            >
              <Input
                className="width-30"
                defaultValue={options.jsonData.profile1}
                onChange={onUpdateDatasourceJsonDataOption(this.props, 'profile1')}
              />
      </InlineField>
      <InlineField
          label="Dedicated Region"
          labelWidth={28}
          tooltip="Configure Dedicated Region YES/NO (default: NO)"
        >
          <InlineSwitch
            className="width-30"
            defaultChecked={options.jsonData && options.jsonData.customregionbool1 ? options.jsonData.customregionbool1 : false}
            onChange={onUpdateDatasourceJsonDataOptionChecked(this.props, 'customregionbool1')}
          />
        </InlineField>
        </FieldSet>    
      )}

  {/* Custom Region 1 */}
  {options.jsonData.tenancymode === TenancyChoices.multitenancy && options.jsonData.environment === AuthProviders.OCI_USER && options.jsonData?.customregionbool1 && (
  <>
    <InlineField
            label="Region"
            labelWidth={28}
            tooltip="Custom Region"
          >
            <Input
              className="width-30"
              defaultValue={options.jsonData.customregion1}
              onChange={onUpdateDatasourceJsonDataOption(this.props, 'customregion1')}
            />
    </InlineField>
    
    <InlineField
      label="Domain"
      labelWidth={28}
      tooltip="Custom Domain"
    >
      <Input
        placeholder={options.secureJsonFields.customdomain1 ? 'configured' : ''}
        className="width-30"
        onChange={onUpdateDatasourceSecureJsonDataOption(this.props, 'customdomain1')}
      />
    </InlineField>
  </>
  )}

  {/* Commercial Region 1 */}
  {options.jsonData.tenancymode === TenancyChoices.multitenancy && options.jsonData.environment === AuthProviders.OCI_USER && !options.jsonData?.customregionbool1 && (
  <>
      <InlineField
          label="Region"
          labelWidth={28}
          tooltip="Specify the Region"
        >
          <Select
            className="width-30"
            value={
              this.props.options.jsonData.region1
                ? { label: this.props.options.jsonData.region1, value: this.props.options.jsonData.region1 }
                : undefined
            }
            allowCustomValue
            onCreateOption={(customRegion1) => {
              const newOption: SelectableValue<string> = {
                label: customRegion1,
                value: customRegion1,
              };
              // Update regions array to include the new option
              this.setState((prevState) => ({
                dynamicRegion1: [...prevState.dynamicRegion1, customRegion1],
              }));                    
              // this.handleRegionChange(newOption, 1);
              onUpdateDatasourceJsonDataOptionSelect(this.props, 'region1')(newOption);
            }}
            options={this.state.dynamicRegion1.map((region) => ({
              label: region,
              value: region,
            }))}
            defaultValue={
              this.props.options.jsonData.region1
                ? { label: this.props.options.jsonData.region1, value: this.props.options.jsonData.region1 }
                : undefined
            }
            onChange={(option) => {
              onUpdateDatasourceJsonDataOptionSelect(this.props, 'region1')(option);
            }}
          />      
        </InlineField>
        </>
      )}
  {/* DEFAULT Conf */}
  {options.jsonData.tenancymode === TenancyChoices.multitenancy && options.jsonData.environment === AuthProviders.OCI_USER && (
  <> 
        <InlineField
              label="User OCID"
              labelWidth={28}
              tooltip="User OCID"
            >
              <Input
                className="width-30"
                placeholder={options.secureJsonFields.user1 ? 'configured' : ''}
                onChange={onUpdateDatasourceSecureJsonDataOption(this.props, 'user1')}
                />
      </InlineField>
      <InlineField
              label="Tenancy OCID"
              labelWidth={28}
              tooltip="Tenancy OCID"
            >
              <Input
                className="width-30"
                placeholder={options.secureJsonFields.tenancy1 ? 'configured' : ''}
                onChange={onUpdateDatasourceSecureJsonDataOption(this.props, 'tenancy1')}
                />
      </InlineField>
      <InlineField
              label="Fingerprint"
              labelWidth={28}
              tooltip="Fingerprint"
            >
              <Input
                className="width-30"
                placeholder={options.secureJsonFields.fingerprint1 ? 'configured' : ''}
                onChange={onUpdateDatasourceSecureJsonDataOption(this.props, 'fingerprint1')}
                />
      </InlineField>
      <InlineField
              label="Private Key"
              labelWidth={28}
              tooltip="Private Key"
            >
              <TextArea
                type="text"
                className="width-30"
                placeholder={options.secureJsonFields.privkey1 ? 'configured' : ''}
                cols={20}
                rows={4}
                maxLength={4096}
                onChange={onUpdateDatasourceSecureJsonDataOption(this.props, 'privkey1')}
                />
      </InlineField>
      <InlineField
          label="Add another Tenancy ?"
          labelWidth={28}
          tooltip="Add Another tenancy YES/NO"
        >
          <InlineSwitch
            className="width-30"
            defaultChecked={options.jsonData && options.jsonData.addon1 ? options.jsonData.addon1 : false}
            onChange={onUpdateDatasourceJsonDataOptionChecked(this.props, 'addon1')}
          />
        </InlineField>
        </>
        )}      


{/**
 * --------------------------------------------------------------------------
 *                          Multitenancy 2
 * --------------------------------------------------------------------------
 */}

{/* User Principals - Multitenancy Tenancy 2*/}
<br/>
{options.jsonData.tenancymode === TenancyChoices.multitenancy && options.jsonData.addon1 === true && options.jsonData.environment === AuthProviders.OCI_USER && (
      <FieldSet label="Tenancy-2 Connection Details">
      <InlineField
              label="Config Profile Name"
              labelWidth={28}
              tooltip="Config profile name. Default value is DEFAULT."
            >
              <Input
                className="width-30"
                defaultValue={options.jsonData.profile2}
                onChange={onUpdateDatasourceJsonDataOption(this.props, 'profile2')}
              />
      </InlineField>
      <InlineField
          label="Dedicated Region"
          labelWidth={28}
          tooltip="Configure Dedicated Region YES/NO (default: NO)"
        >
          <InlineSwitch
            className="width-30"
            defaultChecked={options.jsonData && options.jsonData.customregionbool2 ? options.jsonData.customregionbool2 : false}
            onChange={onUpdateDatasourceJsonDataOptionChecked(this.props, 'customregionbool2')}
          />
        </InlineField>
        </FieldSet>    
      )}

  {/* Custom Region 2 */}
  {options.jsonData.tenancymode === TenancyChoices.multitenancy && options.jsonData.addon1 === true && options.jsonData.environment === AuthProviders.OCI_USER && options.jsonData?.customregionbool2 && (
  <>
    <InlineField
            label="Region"
            labelWidth={28}
            tooltip="Custom Region"
          >
            <Input
              className="width-30"
              defaultValue={options.jsonData.customregion2}
              onChange={onUpdateDatasourceJsonDataOption(this.props, 'customregion2')}
            />
    </InlineField>
    
    <InlineField
      label="Domain"
      labelWidth={28}
      tooltip="Custom Domain"
    >
      <Input
        placeholder={options.secureJsonFields.customdomain2 ? 'configured' : ''}
        className="width-30"
        onChange={onUpdateDatasourceSecureJsonDataOption(this.props, 'customdomain2')}
      />
    </InlineField>
  </>
  )}

  {/* Commercial Region 2 */}
  {options.jsonData.tenancymode === TenancyChoices.multitenancy && options.jsonData.addon1 === true && options.jsonData.environment === AuthProviders.OCI_USER && !options.jsonData?.customregionbool2 && (
  <>
      <InlineField
          label="Region"
          labelWidth={28}
          tooltip="Specify the Region"
        >
          <Select
            className="width-30"
            value={
              this.props.options.jsonData.region2
                ? { label: this.props.options.jsonData.region2, value: this.props.options.jsonData.region2 }
                : undefined
            }
            allowCustomValue
            onCreateOption={(customRegion2) => {
              const newOption: SelectableValue<string> = {
                label: customRegion2,
                value: customRegion2,
              };
              // Update regions array to include the new option
              this.setState((prevState) => ({
                dynamicRegion2: [...prevState.dynamicRegion2, customRegion2],
              }));                    
              // this.handleRegionChange(newOption, 2);
              onUpdateDatasourceJsonDataOptionSelect(this.props, 'region2')(newOption);
            }}
            options={this.state.dynamicRegion2.map((region) => ({
              label: region,
              value: region,
            }))}
            defaultValue={
              this.props.options.jsonData.region2
                ? { label: this.props.options.jsonData.region2, value: this.props.options.jsonData.region2 }
                : undefined
            }
            onChange={(option) => {
              onUpdateDatasourceJsonDataOptionSelect(this.props, 'region2')(option);
            }}
          />      
        </InlineField>
        </>
      )}
  {/* DEFAULT Conf */}
  {options.jsonData.tenancymode === TenancyChoices.multitenancy && options.jsonData.addon1 === true && options.jsonData.environment === AuthProviders.OCI_USER && (
  <> 
        <InlineField
              label="User OCID"
              labelWidth={28}
              tooltip="User OCID"
            >
              <Input
                className="width-30"
                placeholder={options.secureJsonFields.user2 ? 'configured' : ''}
                onChange={onUpdateDatasourceSecureJsonDataOption(this.props, 'user2')}
                />
      </InlineField>
      <InlineField
              label="Tenancy OCID"
              labelWidth={28}
              tooltip="Tenancy OCID"
            >
              <Input
                className="width-30"
                placeholder={options.secureJsonFields.tenancy2 ? 'configured' : ''}
                onChange={onUpdateDatasourceSecureJsonDataOption(this.props, 'tenancy2')}
                />
      </InlineField>
      <InlineField
              label="Fingerprint"
              labelWidth={28}
              tooltip="Fingerprint"
            >
              <Input
                className="width-30"
                placeholder={options.secureJsonFields.fingerprint2 ? 'configured' : ''}
                onChange={onUpdateDatasourceSecureJsonDataOption(this.props, 'fingerprint2')}
                />
      </InlineField>
      <InlineField
              label="Private Key"
              labelWidth={28}
              tooltip="Private Key"
            >
              <TextArea
                type="text"
                className="width-30"
                placeholder={options.secureJsonFields.privkey2 ? 'configured' : ''}
                cols={20}
                rows={4}
                maxLength={4096}
                onChange={onUpdateDatasourceSecureJsonDataOption(this.props, 'privkey2')}
                />
      </InlineField>
      <InlineField
          label="Add another Tenancy ?"
          labelWidth={28}
          tooltip="Add Another tenancy YES/NO"
        >
          <InlineSwitch
            className="width-30"
            defaultChecked={options.jsonData && options.jsonData.addon2 ? options.jsonData.addon2 : false}
            onChange={onUpdateDatasourceJsonDataOptionChecked(this.props, 'addon2')}
          />
        </InlineField>
        </>
        )}



{/**
 * --------------------------------------------------------------------------
 *                          Multitenancy 3
 * --------------------------------------------------------------------------
 */}

{/* User Principals - Multitenancy Tenancy 3*/}
<br/>
{options.jsonData.tenancymode === TenancyChoices.multitenancy && options.jsonData.addon2 === true && options.jsonData.environment === AuthProviders.OCI_USER && (
      <FieldSet label="Tenancy-3 Connection Details">
      <InlineField
              label="Config Profile Name"
              labelWidth={28}
              tooltip="Config profile name. Default value is DEFAULT."
            >
              <Input
                className="width-30"
                defaultValue={options.jsonData.profile3}
                onChange={onUpdateDatasourceJsonDataOption(this.props, 'profile3')}
              />
      </InlineField>
      <InlineField
          label="Dedicated Region"
          labelWidth={28}
          tooltip="Configure Dedicated Region YES/NO (default: NO)"
        >
          <InlineSwitch
            className="width-30"
            defaultChecked={options.jsonData && options.jsonData.customregionbool3 ? options.jsonData.customregionbool3 : false}
            onChange={onUpdateDatasourceJsonDataOptionChecked(this.props, 'customregionbool3')}
          />
        </InlineField>
        </FieldSet>    
      )}

  {/* Custom Region 3 */}
  {options.jsonData.tenancymode === TenancyChoices.multitenancy && options.jsonData.addon2 === true && options.jsonData.environment === AuthProviders.OCI_USER && options.jsonData?.customregionbool3 && (
  <>
    <InlineField
            label="Region"
            labelWidth={28}
            tooltip="Custom Region"
          >
            <Input
              className="width-30"
              defaultValue={options.jsonData.customregion3}
              onChange={onUpdateDatasourceJsonDataOption(this.props, 'customregion3')}
            />
    </InlineField>
    
    <InlineField
      label="Domain"
      labelWidth={28}
      tooltip="Custom Domain"
    >
      <Input
        placeholder={options.secureJsonFields.customdomain3 ? 'configured' : ''}
        className="width-30"
        onChange={onUpdateDatasourceSecureJsonDataOption(this.props, 'customdomain3')}
      />
    </InlineField>
  </>
  )}

  {/* Commercial Region 3 */}
  {options.jsonData.tenancymode === TenancyChoices.multitenancy && options.jsonData.addon2 === true && options.jsonData.environment === AuthProviders.OCI_USER && !options.jsonData?.customregionbool3 && (
  <>
      <InlineField
          label="Region"
          labelWidth={28}
          tooltip="Specify the Region"
        >
          <Select
            className="width-30"
            value={
              this.props.options.jsonData.region3
                ? { label: this.props.options.jsonData.region3, value: this.props.options.jsonData.region3 }
                : undefined
            }
            allowCustomValue
            onCreateOption={(customRegion3) => {
              const newOption: SelectableValue<string> = {
                label: customRegion3,
                value: customRegion3,
              };
              // Update regions array to include the new option
              this.setState((prevState) => ({
                dynamicRegion3: [...prevState.dynamicRegion3, customRegion3],
              }));                    
              // this.handleRegionChange(newOption, 3);
              onUpdateDatasourceJsonDataOptionSelect(this.props, 'region3')(newOption);
            }}
            options={this.state.dynamicRegion3.map((region) => ({
              label: region,
              value: region,
            }))}
            defaultValue={
              this.props.options.jsonData.region3
                ? { label: this.props.options.jsonData.region3, value: this.props.options.jsonData.region3 }
                : undefined
            }
            onChange={(option) => {
              onUpdateDatasourceJsonDataOptionSelect(this.props, 'region3')(option);
            }}
          />      
        </InlineField>
        </>
      )}
  {/* DEFAULT Conf */}
  {options.jsonData.tenancymode === TenancyChoices.multitenancy && options.jsonData.addon2 === true && options.jsonData.environment === AuthProviders.OCI_USER && (
  <> 
        <InlineField
              label="User OCID"
              labelWidth={28}
              tooltip="User OCID"
            >
              <Input
                className="width-30"
                placeholder={options.secureJsonFields.user3 ? 'configured' : ''}
                onChange={onUpdateDatasourceSecureJsonDataOption(this.props, 'user3')}
                />
      </InlineField>
      <InlineField
              label="Tenancy OCID"
              labelWidth={28}
              tooltip="Tenancy OCID"
            >
              <Input
                className="width-30"
                placeholder={options.secureJsonFields.tenancy3 ? 'configured' : ''}
                onChange={onUpdateDatasourceSecureJsonDataOption(this.props, 'tenancy3')}
                />
      </InlineField>
      <InlineField
              label="Fingerprint"
              labelWidth={28}
              tooltip="Fingerprint"
            >
              <Input
                className="width-30"
                placeholder={options.secureJsonFields.fingerprint3 ? 'configured' : ''}
                onChange={onUpdateDatasourceSecureJsonDataOption(this.props, 'fingerprint3')}
                />
      </InlineField>
      <InlineField
              label="Private Key"
              labelWidth={28}
              tooltip="Private Key"
            >
              <TextArea
                type="text"
                className="width-30"
                placeholder={options.secureJsonFields.privkey3 ? 'configured' : ''}
                cols={20}
                rows={4}
                maxLength={4096}
                onChange={onUpdateDatasourceSecureJsonDataOption(this.props, 'privkey3')}
                />
      </InlineField>
      <InlineField
          label="Add another Tenancy ?"
          labelWidth={28}
          tooltip="Add Another tenancy YES/NO"
        >
          <InlineSwitch
            className="width-30"
            defaultChecked={options.jsonData && options.jsonData.addon3 ? options.jsonData.addon3 : false}
            onChange={onUpdateDatasourceJsonDataOptionChecked(this.props, 'addon3')}
          />
        </InlineField>
        </>
        )}

{/**
 * --------------------------------------------------------------------------
 *                          Multitenancy 4
 * --------------------------------------------------------------------------
 */}

{/* User Principals - Multitenancy Tenancy 4 */}
<br/>
{options.jsonData.tenancymode === TenancyChoices.multitenancy && options.jsonData.addon3 === true && options.jsonData.environment === AuthProviders.OCI_USER && (
      <FieldSet label="Tenancy-4 Connection Details">
      <InlineField
              label="Config Profile Name"
              labelWidth={28}
              tooltip="Config profile name. Default value is DEFAULT."
            >
              <Input
                className="width-30"
                defaultValue={options.jsonData.profile4}
                onChange={onUpdateDatasourceJsonDataOption(this.props, 'profile4')}
              />
      </InlineField>
      <InlineField
          label="Dedicated Region"
          labelWidth={28}
          tooltip="Configure Dedicated Region YES/NO (default: NO)"
        >
          <InlineSwitch
            className="width-30"
            defaultChecked={options.jsonData && options.jsonData.customregionbool4 ? options.jsonData.customregionbool4 : false}
            onChange={onUpdateDatasourceJsonDataOptionChecked(this.props, 'customregionbool4')}
          />
        </InlineField>
        </FieldSet>    
      )}

  {/* Custom Region 4 */}
  {options.jsonData.tenancymode === TenancyChoices.multitenancy && options.jsonData.addon3 === true && options.jsonData.environment === AuthProviders.OCI_USER && options.jsonData?.customregionbool4 && (
  <>
    <InlineField
            label="Region"
            labelWidth={28}
            tooltip="Custom Region"
          >
            <Input
              className="width-30"
              defaultValue={options.jsonData.customregion4}
              onChange={onUpdateDatasourceJsonDataOption(this.props, 'customregion4')}
            />
    </InlineField>
    
    <InlineField
      label="Domain"
      labelWidth={28}
      tooltip="Custom Domain"
    >
      <Input
        placeholder={options.secureJsonFields.customdomain4 ? 'configured' : ''}
        className="width-30"
        onChange={onUpdateDatasourceSecureJsonDataOption(this.props, 'customdomain4')}
      />
    </InlineField>
  </>
  )}

  {/* Commercial Region 4 */}
  {options.jsonData.tenancymode === TenancyChoices.multitenancy && options.jsonData.addon3 === true && options.jsonData.environment === AuthProviders.OCI_USER && !options.jsonData?.customregionbool4 && (
  <>
      <InlineField
          label="Region"
          labelWidth={28}
          tooltip="Specify the Region"
        >
          <Select
            className="width-30"
            value={
              this.props.options.jsonData.region4
                ? { label: this.props.options.jsonData.region4, value: this.props.options.jsonData.region4 }
                : undefined
            }
            allowCustomValue
            onCreateOption={(customRegion4) => {
              const newOption: SelectableValue<string> = {
                label: customRegion4,
                value: customRegion4,
              };
              // Update regions array to include the new option
              this.setState((prevState) => ({
                dynamicRegion4: [...prevState.dynamicRegion4, customRegion4],
              }));                    
              // this.handleRegionChange(newOption, 4);
              onUpdateDatasourceJsonDataOptionSelect(this.props, 'region4')(newOption);
            }}
            options={this.state.dynamicRegion4.map((region) => ({
              label: region,
              value: region,
            }))}
            defaultValue={
              this.props.options.jsonData.region4
                ? { label: this.props.options.jsonData.region4, value: this.props.options.jsonData.region4 }
                : undefined
            }
            onChange={(option) => {
              onUpdateDatasourceJsonDataOptionSelect(this.props, 'region4')(option);
            }}
          />      
        </InlineField>
        </>
      )}
  {/* DEFAULT Conf */}
  {options.jsonData.tenancymode === TenancyChoices.multitenancy && options.jsonData.addon3 === true && options.jsonData.environment === AuthProviders.OCI_USER && (
  <> 
        <InlineField
              label="User OCID"
              labelWidth={28}
              tooltip="User OCID"
            >
              <Input
                className="width-30"
                placeholder={options.secureJsonFields.user4 ? 'configured' : ''}
                onChange={onUpdateDatasourceSecureJsonDataOption(this.props, 'user4')}
                />
      </InlineField>
      <InlineField
              label="Tenancy OCID"
              labelWidth={28}
              tooltip="Tenancy OCID"
            >
              <Input
                className="width-30"
                placeholder={options.secureJsonFields.tenancy4 ? 'configured' : ''}
                onChange={onUpdateDatasourceSecureJsonDataOption(this.props, 'tenancy4')}
                />
      </InlineField>
      <InlineField
              label="Fingerprint"
              labelWidth={28}
              tooltip="Fingerprint"
            >
              <Input
                className="width-30"
                placeholder={options.secureJsonFields.fingerprint4 ? 'configured' : ''}
                onChange={onUpdateDatasourceSecureJsonDataOption(this.props, 'fingerprint4')}
                />
      </InlineField>
      <InlineField
              label="Private Key"
              labelWidth={28}
              tooltip="Private Key"
            >
              <TextArea
                type="text"
                className="width-30"
                placeholder={options.secureJsonFields.privkey4 ? 'configured' : ''}
                cols={20}
                rows={4}
                maxLength={3096}
                onChange={onUpdateDatasourceSecureJsonDataOption(this.props, 'privkey4')}
                />
      </InlineField>
      <InlineField
          label="Add another Tenancy ?"
          labelWidth={28}
          tooltip="Add Another tenancy YES/NO"
        >
          <InlineSwitch
            className="width-30"
            defaultChecked={options.jsonData && options.jsonData.addon4 ? options.jsonData.addon4 : false}
            onChange={onUpdateDatasourceJsonDataOptionChecked(this.props, 'addon4')}
          />
        </InlineField>
        </>
        )}
        

{/**
 * --------------------------------------------------------------------------
 *                          Multitenancy 5
 * --------------------------------------------------------------------------
 */}

{/* User Principals - Multitenancy Tenancy 5 */}
<br/>
{options.jsonData.tenancymode === TenancyChoices.multitenancy && options.jsonData.addon4 === true && options.jsonData.environment === AuthProviders.OCI_USER && (
      <FieldSet label="Tenancy-5 Connection Details">
      <InlineField
              label="Config Profile Name"
              labelWidth={28}
              tooltip="Config profile name. Default value is DEFAULT."
            >
              <Input
                className="width-30"
                defaultValue={options.jsonData.profile5}
                onChange={onUpdateDatasourceJsonDataOption(this.props, 'profile5')}
              />
      </InlineField>
      <InlineField
          label="Dedicated Region"
          labelWidth={28}
          tooltip="Configure Dedicated Region YES/NO (default: NO)"
        >
          <InlineSwitch
            className="width-30"
            defaultChecked={options.jsonData && options.jsonData.customregionbool5 ? options.jsonData.customregionbool5 : false}
            onChange={onUpdateDatasourceJsonDataOptionChecked(this.props, 'customregionbool5')}
          />
        </InlineField>
        </FieldSet>    
      )}

  {/* Custom Region 5 */}
  {options.jsonData.tenancymode === TenancyChoices.multitenancy && options.jsonData.addon4 === true && options.jsonData.environment === AuthProviders.OCI_USER && options.jsonData?.customregionbool5 && (
  <>
    <InlineField
            label="Region"
            labelWidth={28}
            tooltip="Custom Region"
          >
            <Input
              className="width-30"
              defaultValue={options.jsonData.customregion5}
              onChange={onUpdateDatasourceJsonDataOption(this.props, 'customregion5')}
            />
    </InlineField>
    
    <InlineField
      label="Domain"
      labelWidth={28}
      tooltip="Custom Domain"
    >
      <Input
        placeholder={options.secureJsonFields.customdomain5 ? 'configured' : ''}
        className="width-30"
        onChange={onUpdateDatasourceSecureJsonDataOption(this.props, 'customdomain5')}
      />
    </InlineField>
  </>
  )}

  {/* Commercial Region 5 */}
  {options.jsonData.tenancymode === TenancyChoices.multitenancy && options.jsonData.addon4 === true && options.jsonData.environment === AuthProviders.OCI_USER && !options.jsonData?.customregionbool5 && (
  <>
      <InlineField
          label="Region"
          labelWidth={28}
          tooltip="Specify the Region"
        >
          <Select
            className="width-30"
            value={
              this.props.options.jsonData.region5
                ? { label: this.props.options.jsonData.region5, value: this.props.options.jsonData.region5 }
                : undefined
            }
            allowCustomValue
            onCreateOption={(customRegion5) => {
              const newOption: SelectableValue<string> = {
                label: customRegion5,
                value: customRegion5,
              };
              // Update regions array to include the new option
              this.setState((prevState) => ({
                dynamicRegion5: [...prevState.dynamicRegion5, customRegion5],
              }));                    
              // this.handleRegionChange(newOption, 5);
              onUpdateDatasourceJsonDataOptionSelect(this.props, 'region5')(newOption);
            }}
            options={this.state.dynamicRegion5.map((region) => ({
              label: region,
              value: region,
            }))}
            defaultValue={
              this.props.options.jsonData.region5
                ? { label: this.props.options.jsonData.region5, value: this.props.options.jsonData.region5 }
                : undefined
            }
            onChange={(option) => {
              onUpdateDatasourceJsonDataOptionSelect(this.props, 'region5')(option);
            }}
          />      
        </InlineField>
        </>
      )}
  {/* DEFAULT Conf */}
  {options.jsonData.tenancymode === TenancyChoices.multitenancy && options.jsonData.addon4 === true && options.jsonData.environment === AuthProviders.OCI_USER && (
  <> 
        <InlineField
              label="User OCID"
              labelWidth={28}
              tooltip="User OCID"
            >
              <Input
                className="width-30"
                placeholder={options.secureJsonFields.user5 ? 'configured' : ''}
                onChange={onUpdateDatasourceSecureJsonDataOption(this.props, 'user5')}
                />
      </InlineField>
      <InlineField
              label="Tenancy OCID"
              labelWidth={28}
              tooltip="Tenancy OCID"
            >
              <Input
                className="width-30"
                placeholder={options.secureJsonFields.tenancy5 ? 'configured' : ''}
                onChange={onUpdateDatasourceSecureJsonDataOption(this.props, 'tenancy5')}
                />
      </InlineField>
      <InlineField
              label="Fingerprint"
              labelWidth={28}
              tooltip="Fingerprint"
            >
              <Input
                className="width-30"
                placeholder={options.secureJsonFields.fingerprint5 ? 'configured' : ''}
                onChange={onUpdateDatasourceSecureJsonDataOption(this.props, 'fingerprint5')}
                />
      </InlineField>
      <InlineField
              label="Private Key"
              labelWidth={28}
              tooltip="Private Key"
            >
              <TextArea
                type="text"
                className="width-30"
                placeholder={options.secureJsonFields.privkey5 ? 'configured' : ''}
                cols={20}
                rows={4}
                maxLength={3096}
                onChange={onUpdateDatasourceSecureJsonDataOption(this.props, 'privkey5')}
                />
      </InlineField>
        </>
        )}


      </FieldSet>
    );
  }
}
