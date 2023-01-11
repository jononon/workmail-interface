import {
  IonBadge,
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import ExploreContainer from "../components/ExploreContainer";
import "./Tab1.css";
import { useEffect, useState } from "react";
import { AliasInfo } from "../types";
import { API } from "aws-amplify";
import { clipboardOutline } from "ionicons/icons";

const colorForState = (state: string) => {
  switch (state) {
    case "ENABLED":
      return "success";
    case "DISABLED":
      return "warning";
    case "DELETED":
      return "danger";
    default:
      return "warning";
  }
};

const capsFirstLetter = (str: string) => {
  if (str.length == 0) {
    return str;
  } else if (str.length == 1) {
    return str.toUpperCase();
  } else if (str.length > 1) {
    return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();
  }
};

const Tab1: React.FC = () => {
  const [aliases, setAliases] = useState<Array<AliasInfo>>([]);
  const [filterTerm, setFilterTerm] = useState<string>("");

  console.log(aliases);
  useEffect(() => {
    // Create an scoped async function in the hook
    async function getAliases() {
      const aliases = (await API.get(
        "workmailinterfaceapi",
        "/aliases",
        {}
      )) as Array<AliasInfo>;
      setAliases(aliases);
    }
    // Execute the created function directly
    getAliases();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>All Groups</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">All Groups</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonSearchbar
          debounce={1000}
          onIonChange={(e) => {
            let query = "";
            const target = e.target as HTMLIonSearchbarElement;
            if (target) query = target.value!.toLowerCase();

            setFilterTerm(query);
          }}
        ></IonSearchbar>
        <IonList>
          {aliases
            .filter((alias) => {
              if (alias.Name.toLowerCase().includes(filterTerm)) {
                return true;
              } else if (alias.Email !== undefined) {
                return alias.Email.toLowerCase().includes(filterTerm);
              } else {
                return false;
              }
            })
            .map((alias, index) => (
              <IonItem key={index}>
                <IonLabel>
                  <h3>{alias.Name}</h3>
                  <p>
                    {alias.Email}{" "}
                    <a
                      role="button"
                      onClick={() => {
                        navigator.clipboard.writeText(alias.Email);
                      }}
                    >
                      <IonIcon icon={clipboardOutline}></IonIcon>
                    </a>
                  </p>
                </IonLabel>
                <IonBadge slot="end" color={colorForState(alias.State)}>
                  {capsFirstLetter(alias.State)}
                </IonBadge>
                <IonButton size="small" slot="end">
                  Small
                </IonButton>
              </IonItem>
            ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
