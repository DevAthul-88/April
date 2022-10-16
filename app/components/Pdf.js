import React from "react"
import { Page, Document, StyleSheet, View } from "@react-pdf/renderer"
import logo from "../../pages/logo.svg"
import InvoiceTitle from "./InvoiceTitle"
import InvoiceNo from "./InvoiceNo"
import BillTo from "./BillTo"
import InvoiceThankYouMsg from "./InvoiceThankYouMsg"
import InvoiceItemsTable from "./InvoiceItemsTable"
import Image from "next/image"

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    fontFamily: "Helvetica",
    fontSize: 11,
    paddingTop: 30,
    paddingLeft: 50,
    paddingRight: 50,
    lineHeight: 1.5,
    flexDirection: "column",
  },
  logo: {
    width: 84,
    height: 70,
    marginLeft: "auto",
    marginRight: "auto",
  },
})

const Pdf = ({ invoicedata, client, currentUser }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <InvoiceTitle title={"Invoice"} />
        <InvoiceNo invoice={invoicedata} />

        <BillTo invoice={client} />

        <InvoiceItemsTable invoice={invoicedata.meta} country={invoicedata.currency} />
        <InvoiceThankYouMsg />
      </Page>
    </Document>
  )
}

export default Pdf
