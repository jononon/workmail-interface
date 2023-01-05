import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonNote,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import ExploreContainer from "../components/ExploreContainer";
import "./Tab1.css";
import { useEffect, useState } from "react";
import { AliasInfo } from "../types";
import { API } from "aws-amplify";

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

const Tab1: React.FC = () => {
  const [aliases, setAliases] = useState<Array<AliasInfo>>([]);
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
          <IonTitle>Tab 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Tab 1 page" />
        <IonList>
          {aliases.map((alias, index) => (
            <IonItem key={index}>
              <IonTitle>{alias.Name}</IonTitle>
              <IonNote slot="end" color={colorForState(alias.State)}>
                {alias.State}
              </IonNote>
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
