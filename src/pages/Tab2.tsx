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
            <IonTitle size="large">Tab 2</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Tab 2 page" />
        <Formik
          initialValues={{ aliasName: "", accountType: "" }}
          onSubmit={(values) => {
            console.log(values);
            API.post("workmailinterfaceapi", "/aliases", { body: values });
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
              <Field
                name="aliasName"
                label="Alias Name"
                type="text"
                component={IonInputWrapper}
              />

              <IonList>
                <IonRadioGroup
                  value={values.accountType}
                  onIonChange={(e) => (values.accountType = e.detail.value)}
                >
                  <IonListHeader>
                    <IonLabel>Name</IonLabel>
                  </IonListHeader>

                  <IonItem>
                    <IonLabel>Account</IonLabel>
                    <IonRadio slot="start" value="account" />
                  </IonItem>

                  <IonItem>
                    <IonLabel>Orders</IonLabel>
                    <IonRadio slot="start" value="orders" />
                  </IonItem>

                  <IonItem>
                    <IonLabel>Other</IonLabel>
                    <IonRadio slot="start" value="other" />
                  </IonItem>
                </IonRadioGroup>
              </IonList>

              <IonButton type="submit">Submit</IonButton>
              {/* <button type="submit">Submit</button> */}
            </form>
          )}
        </Formik>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
