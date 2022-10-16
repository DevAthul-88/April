import React from "react"
import { Text, View, StyleSheet } from "@react-pdf/renderer"
import getSymbolFromCurrency from "currency-symbol-map"
import { Country } from "country-state-city"

const borderColor = "#3778C2"
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderBottomColor: "#3778C2",
    borderBottomWidth: 1,
    alignItems: "center",
    height: 24,
    fontSize: 12,
    fontStyle: "bold",
  },
  description: {
    width: "85%",
    textAlign: "right",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingRight: 8,
  },
  total: {
    width: "15%",
    textAlign: "right",
    paddingRight: 8,
  },
})

const InvoiceTableFooter = ({ items, country }) => {
  const total = items
    .map((item) => item.quantity * item.price)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0)
  return (
    <View style={styles.row}>
      <Text style={styles.description}>TOTAL</Text>
      <Text style={styles.total}>
        {getSymbolFromCurrency(Country.getCountryByCode(country).currency)}{" "}
        {Number.parseFloat(total).toFixed(2)}
      </Text>
    </View>
  )
}

export default InvoiceTableFooter
