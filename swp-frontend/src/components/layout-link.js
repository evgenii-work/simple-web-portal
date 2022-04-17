import React from "react";
import { Link } from "@chakra-ui/react";
import { Link as RRLink } from "react-router-dom";
import Translate from "../components/translate";

export default function LayoutLink(props) {
  return (
    <Link
      as={RRLink}
      color={props.selected === props.name ? "text.200" : "text.100"}
      to={props.to}
      m="auto"
      p="0 1rem"
      fontWeight="bold"
    >
      {props.label && <Translate>{props.label}</Translate>}
      {!props.label && <Translate>{props.name}</Translate>}
    </Link>
  );
}
