import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonRadio,
  IonRadioGroup,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import ExploreContainer from "../components/ExploreContainer";
import "./Tab2.css";
import { Field, FieldProps, Formik } from "formik";
import { API } from "aws-amplify";

/*
Alias Name
Type: Account, Orders, Other
*/

const IonInputWrapper = ({
  field,
  form,
  ...props
}: FieldProps & { label: string }) => (
  <IonItem className="item ion-no-padding" lines="none">
    <IonLabel position="stacked">{props.label}</IonLabel>
    <IonInput
      mode="ios"
      onIonChange={(e) => form.setFieldValue(field.name, e.detail.value)}
      {...props}
    />
  </IonItem>
);

const IonRadioWrapper = ({
  field,
  form,
  ...props
}: FieldProps & { label: string }) => (
  <IonRadioGroup
    onIonChange={(e) => form.setFieldValue("accountType", e.detail.value)}
  >
    <IonListHeader>
      <IonLabel>{props.label}</IonLabel>
    </IonListHeader>

    <IonItem>
      <IonLabel>Account</IonLabel>
      <IonRadio slot="start" value="Accounts" />
    </IonItem>

    <IonItem>
      <IonLabel>Orders</IonLabel>
      <IonRadio slot="start" value="Orders" />
    </IonItem>

    <IonItem>
      <IonLabel>None</IonLabel>
      <IonRadio slot="start" value="" />
    </IonItem>
  </IonRadioGroup>
);

const Tab2: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 2</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Create New Alias</IonTitle>
          </IonToolbar>
        </IonHeader>
        <Formik
          initialValues={{ aliasName: "", accountType: "" }}
          onSubmit={(values) => {
            console.log(values);
            API.post("workmailinterfaceapi", "/aliases", {
              body: {
                aliasName: `${values.accountType}-${values.aliasName}`,
                email: `${values.aliasName.toLowerCase()}.${values.accountType.toLowerCase()}@jonathandamico.me`,
              },
            });
          }}
          validate={(values) => {
            const errors: any = {};
            if (!values.aliasName) {
              errors.aliasName = "Required";
            }
            if (!values.accountType) {
              errors.accountType = "Required";
            }
            return errors;
          }}
        >
          {({ values, handleChange, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <IonList>
                <Field
                  name="aliasName"
                  label="Alias Name"
                  type="text"
                  component={IonInputWrapper}
                />

                <Field
                  name="accountType"
                  label="Account Type"
                  component={IonRadioWrapper}
                />

                <IonItem>
                  <IonLabel>
                    Alias Name: {`${values.accountType}-${values.aliasName}`}
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>
                    Email:{" "}
                    {`${values.aliasName.toLowerCase()}.${values.accountType.toLowerCase()}@jonathandamico.me`}
                  </IonLabel>
                </IonItem>

                <IonButton type="submit">Submit</IonButton>
              </IonList>
              {/* <button type="submit">Submit</button> */}
            </form>
          )}
        </Formik>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
