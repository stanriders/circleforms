import React from "react";
import Unauthorized from "src/components/Unauthorized";
import useAuth from "src/hooks/useAuth";

import CreateForm from "../components/CreateForm/CreateForm";
import { Locales } from "../types/common-types";

const CreateNewForm = () => {
  const { data: user } = useAuth();

  if (!user) {
    return <Unauthorized />;
  }

  return <CreateForm />;
};

export async function getStaticProps({ locale }: { locale: Locales }) {
  const [translations, global] = await Promise.all([
    import(`../messages/create-a-form/${locale}.json`),
    import(`../messages/global/${locale}.json`)
  ]);

  const messages = {
    ...translations,
    ...global
  };

  return {
    props: {
      messages
    }
  };
}

export default CreateNewForm;
