import {
  IonButton,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
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
import "./Tab2.css";
import { Field, FieldProps, Formik } from "formik";
import { API } from "aws-amplify";
import { useState } from "react";

/*
Alias Name
Type: Account, Orders, Other
*/

const IonInputWrapper = ({
  field,
  form,
  ...props
}: FieldProps & { label: string }) => (
  <>
    <IonListHeader lines="full">
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
    <IonListHeader lines="full">
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

const IonCheckboxWrapper = ({
  field,
  form,
  ...props
}: FieldProps & { label: string }) => (
  <IonItem>
    <IonCheckbox
      slot="start"
      mode="ios"
      onIonChange={(e) => {
        console.log(e);
        console.log(e.detail.value);
        form.setFieldValue(field.name, e.detail.value);
      }}
      {...props}
    />
    <IonLabel>{props.label}</IonLabel>
  </IonItem>
);

const Tab2: React.FC = () => {
  const [presentToast, dismissToast] = useIonToast();

  const generateRandomId = () => {
    const characters = "abcdefghijklmnopqrstuvwxyz";
    let result = "";
    for (let i = 0; i < 5; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    return result;
  };

  const [randomId, setRandomId] = useState<string>(generateRandomId());

  const generateEmail = (
    aliasName: string,
    accountType: string,
    randomize: boolean
  ) => {
    if (aliasName === "") {
      return "";
    }

    let email = aliasName;

    if (accountType !== "none") {
      email += `.${accountType}`;
    }

    if (randomize) {
      email += `.${randomId}`;
    }

    email += "@jonathandamico.me";

    return email.toLowerCase().replace(/\s+/g, "");
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

  const generateGroupName = (
    aliasName: string,
    accountType: string,
    randomize: boolean
  ) => {
    if (aliasName === "") {
      return "";
    }

    let groupName = "";

    if (accountType !== "none" && accountType !== "") {
      groupName += `${uppercaseAccountType(accountType)}-`;
    }

    groupName += aliasName;

    if (randomize) {
      groupName += `-${randomId}`;
    }

    return groupName.replace(/\s+/g, "");
  };

  const presentResponseToast = (message: string, isError: boolean) => {
    dismissToast();
    presentToast({
      color: isError ? "danger" : "success",
      message: message,
      position: "top",
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
          initialValues={{
            aliasName: "",
            accountType: "",
            randomize: false,
          }}
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
                      values.accountType,
                      values.randomize
                    ),
                    email: generateEmail(
                      values.aliasName,
                      values.accountType,
                      values.randomize
                    ),
                  },
                }
              );

              if (response.error === undefined) {
                navigator.clipboard.writeText(
                  generateEmail(
                    values.aliasName,
                    values.accountType,
                    values.randomize
                  )
                );
                presentResponseToast(
                  "Alias Created Successfully, Copied To Clipboard",
                  false
                );
                setRandomId(generateRandomId());
              } else {
                presentResponseToast(response.error.message, true);
              }
            } catch (e) {
              console.log(e);
              if (e instanceof Error) {
                console.log(e);
                presentResponseToast("Group already exists", true);
              }
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

                <IonListHeader lines="full">
                  <IonLabel>Options</IonLabel>
                </IonListHeader>

                <Field
                  name="randomize"
                  label="Create Randomized/Unique Email"
                  component={IonCheckboxWrapper}
                />

                {values.aliasName !== "" && (
                  <>
                    <IonListHeader lines="full">
                      <IonLabel>Summary</IonLabel>
                    </IonListHeader>

                    <IonItem>
                      <IonLabel>
                        Alias Name:{" "}
                        {generateGroupName(
                          values.aliasName,
                          values.accountType,
                          values.randomize
                        )}
                      </IonLabel>
                    </IonItem>
                    <IonItem>
                      <IonLabel>
                        Email:{" "}
                        {generateEmail(
                          values.aliasName,
                          values.accountType,
                          values.randomize
                        )}
                      </IonLabel>
                    </IonItem>
                  </>
                )}

                <IonItem>
                  <IonButton type="submit" size="default">
                    Submit
                  </IonButton>
                </IonItem>
              </IonList>
            </form>
          )}
        </Formik>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
