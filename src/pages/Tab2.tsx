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
  useIonToast,
} from "@ionic/react";
import ExploreContainer from "../components/ExploreContainer";
import "./Tab2.css";
import { Field, FieldProps, Formik } from "formik";
import { API } from "aws-amplify";

/*
Alias Name
Type: Account, Orders, Other
*/

const generateEmail = (aliasName: string, accountType: string) => {
  if (aliasName === "") {
    return "";
  } else if (accountType === "none") {
    return `${aliasName.toLowerCase()}@jonathandamico.me`;
  } else {
    return `${aliasName.toLowerCase()}.${accountType.toLowerCase()}@jonathandamico.me`;
  }
};

const uppercaseAccountType = (accountType: string) => {
  switch (accountType) {
    case "accounts":
      return "Accounts";
    case "orders":
      return "Orders";
    case "mailinglist":
      return "MailingList";
    default:
      return "";
  }
};

const generateGroupName = (aliasName: string, accountType: string) => {
  if (aliasName === "") {
    return "";
  } else if (accountType === "none") {
    return aliasName;
  } else {
    return `${uppercaseAccountType(accountType)}-${aliasName}`;
  }
};

const IonInputWrapper = ({
  field,
  form,
  ...props
}: FieldProps & { label: string }) => (
  <>
    <IonListHeader>
      <IonLabel>{props.label}</IonLabel>
    </IonListHeader>
    <IonItem>
      <IonInput
        mode="ios"
        onIonChange={(e) => form.setFieldValue(field.name, e.detail.value)}
        {...props}
      />
    </IonItem>
  </>
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
      <IonRadio slot="start" value="accounts" />
    </IonItem>

    <IonItem>
      <IonLabel>Orders</IonLabel>
      <IonRadio slot="start" value="orders" />
    </IonItem>

    <IonItem>
      <IonLabel>Mailing List</IonLabel>
      <IonRadio slot="start" value="mailinglist" />
    </IonItem>

    <IonItem>
      <IonLabel>None</IonLabel>
      <IonRadio slot="start" value="none" />
    </IonItem>
  </IonRadioGroup>
);

const Tab2: React.FC = () => {
  const [presentToast, dismissToast] = useIonToast();

  const presentResponseToast = (message: string, isError: boolean) => {
    dismissToast();
    presentToast({
      color: isError ? "danger" : "success",
      message: message,
      buttons: [
        {
          text: "Dismiss",
          role: "cancel",
        },
      ],
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Create New Alias</IonTitle>
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
          onSubmit={async (values) => {
            console.log(values);
            try {
              const response = await API.post(
                "workmailinterfaceapi",
                "/aliases",
                {
                  body: {
                    aliasName: generateGroupName(
                      values.aliasName,
                      values.accountType
                    ),
                    email: generateEmail(values.aliasName, values.accountType),
                  },
                }
              );

              if (response.error === undefined) {
                navigator.clipboard.writeText(
                  generateEmail(values.aliasName, values.accountType)
                );
                presentResponseToast(
                  "Alias Created Successfully, Copied To Clipboard",
                  false
                );
              } else {
                presentResponseToast(response.error.message, true);
              }
            } catch (e) {
              console.log(e);
              console.log(e.response.data.message);
              presentResponseToast("Group already exists", true);
            }
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
                    Alias Name:{" "}
                    {generateGroupName(values.aliasName, values.accountType)}
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>
                    Email: {generateEmail(values.aliasName, values.accountType)}
                  </IonLabel>
                </IonItem>

                <IonButton type="submit">Submit</IonButton>
              </IonList>
            </form>
          )}
        </Formik>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
