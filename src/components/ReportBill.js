import React from "react";
import {
  PDFViewer,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import dayjs from "dayjs";
import "dayjs/locale/th";

Font.register({
  family: "Sarabun",
  fonts: [{ src: "./fonts/Sarabun-Regular.ttf" }],
});

// Create styles
const styles = StyleSheet.create({
  page: {
    fontFamily: "Sarabun",
    padding: "1.905cm",
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableColOrder: {
    width: "10%",
    borderStyle: "solid",
  },
  tableColPrice: {
    width: "12%",
    borderStyle: "solid",
  },
  tableColPerPrice: {
    width: "15%",
    borderStyle: "solid",
  },
  tableColList: {
    width: "63%",
    borderStyle: "solid",
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
  },
});

const MyDocument = ({ listBil, customerDetail, dateDoc, docID }) => {
  return (
    <PDFViewer width={"100%"} height={"900px"}>
      <Document>
        <Page size="A4" style={styles.page}>
          <View>
            <View style={{ position: "absolute" }}>
              <Image
                style={{ width: 80, height: 80 }}
                src="/img/loggrand.png"
              />
            </View>
            <View
              style={{
                textAlign: "center",
                display: "block",
                paddingVertical: 20,
              }}
            >
              <Text style={{ alignSelf: "center", fontSize: 10 }}>
                บริษัท แกรนด์ โลจิสติกส์ จำกัด
              </Text>
              <Text style={{ alignSelf: "center", fontSize: 8 }}>
                52/19 หมู่ที่ 5 ตำบลบางพูน อำเภอเมืองปทุมธานี จังหวัดปทุมธานี
                12000
              </Text>
              <Text style={{ alignSelf: "center", fontSize: 8 }}>
                เลขประจำตัวผู้เสียภาษี 0135563002828
              </Text>
              <Text style={{ alignSelf: "center", fontSize: 8 }}>
                Tel. 088-1141689
              </Text>
            </View>
            <View style={{ textAlign: "center" }}>
              <Text
                style={{ alignSelf: "center", fontSize: 16, marginBottom: 20 }}
              >
                ใบวางบิล
              </Text>
            </View>
            <View style={{ borderWidth: 1 }}>
              <View>
                <View style={{ padding: 2 }}>
                  <Text style={{ fontSize: 10 }}>ชื่อลูกค้า:</Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginBottom: 40,
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      paddingLeft: 40,
                    }}
                  >
                    <Text style={{ fontSize: 10 }}>
                      {customerDetail.cus_name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 10,
                      }}
                    >
                      {customerDetail.address.house_no +
                        " " +
                        customerDetail.address.street +
                        " " +
                        customerDetail.address.subdistrict +
                        " " +
                        customerDetail.address.district +
                        " " +
                        customerDetail.address.province +
                        " " +
                        customerDetail.address.zip_code}
                    </Text>
                    <Text style={{ fontSize: 10 }}>
                      เลขประจำตัวผู้เสียภาษีอากร :{customerDetail.corporate_tax}
                    </Text>
                    <Text style={{ fontSize: 10 }}>
                      โทรศัพท์ {customerDetail.phone_no}
                    </Text>
                  </View>
                  <View style={{ width: 50 }}></View>
                  <View style={{ width: 213, textAlign: "center" }}>
                    <Text style={{ fontSize: 10 }}>เลขที่เอกสาร : {docID}</Text>
                    <Text style={{ marginTop: 5, fontSize: 10 }}>
                      วันที่{" "}
                      {new Date(dateDoc.dateDoc).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Text>
                    <Text style={{ marginTop: 5, fontSize: 10 }}>
                      วันครบกำหนด :{" "}
                      {new Date(dateDoc.dueDate).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Text>
                    <Text style={{ marginTop: 5, fontSize: 10 }}>
                      วันที่วิ่งงาน :{" "}
                      {new Date(dateDoc.dateWork).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Text>
                  </View>
                </View>
                <View style={{ height: 350 }}>
                  <View style={styles.table}>
                    <View style={{ ...styles.tableRow, borderBottomWidth: 1 }}>
                      <View style={styles.tableColOrder}>
                        <Text style={styles.tableCell}>ลำดับ</Text>
                      </View>
                      <View style={styles.tableColList}>
                        <Text style={styles.tableCell}>ราการ</Text>
                      </View>
                      <View style={styles.tableColPerPrice}>
                        <Text style={styles.tableCell}>ราคาต่อเที่ยว</Text>
                      </View>
                      <View style={styles.tableColPrice}>
                        <Text style={styles.tableCell}>จำนวนเงิน</Text>
                      </View>
                    </View>
                    {listBil.map((item, index) => {
                      return (
                        <View key={index} style={styles.tableRow}>
                          <View style={styles.tableColOrder}>
                            <Text style={styles.tableCell}>{index + 1}</Text>
                          </View>
                          <View style={styles.tableColList}>
                            <Text
                              style={{
                                marginTop: 5,
                                marginLeft: 5,
                                fontSize: 10,
                                alignSelf: "start",
                              }}
                            >
                              {item.list + " จำนวน " + item.amount + " คัน"}
                            </Text>
                          </View>
                          <View style={styles.tableColPerPrice}>
                            <Text style={styles.tableCell}>{item.price}</Text>
                          </View>
                          <View style={styles.tableColPrice}>
                            <Text style={styles.tableCell}>
                              {item.amount * item.price}
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                  <View
                    style={{
                      height: 350,
                      width: "100%",
                      flex: 1,
                      flexDirection: "row",
                      position: "absolute",
                      zIndex: 99,
                      borderTopWidth: 1,
                    }}
                  >
                    <View
                      style={{
                        width: "10%",
                        height: "100%",
                        borderRightWidth: 1,
                        borderColor: "#000",
                      }}
                    />
                    <View
                      style={{
                        width: "63%",
                        height: "100%",
                        borderRightWidth: 1,
                        borderColor: "#000",
                      }}
                    />
                    <View
                      style={{
                        width: "15%",
                        height: "100%",
                        borderRightWidth: 1,
                        borderColor: "#000",
                      }}
                    />
                    <View
                      style={{
                        width: "12%",
                        height: "100%",
                        borderColor: "#000",
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};
export default MyDocument;
