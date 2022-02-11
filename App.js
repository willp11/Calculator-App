import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, SafeAreaView, TouchableOpacity } from 'react-native';
import {useState} from 'react';
import React from 'react';

const windowWidth = Dimensions.get('window').width;

export default function App() {

  const [answerValue, setAnswerValue] = useState('0');
  const [memoryValue, setMemoryValue] = useState('0');
  const [operatorValue, setOperatorValue] = useState('0');
  const [readyToReplace, setReadyToReplace] = useState(true);

  const [replaceEquation, setReplaceEquation] = useState(false);
  const [equation, setEquation] = useState('');
  const [equationArray, setEquationArray] = useState([]);

  const [fontSize, setFontSize] = useState(80);

  const buttonPressed = (value) => {
    // Reduce font size if answer value gets too long
    if (answerValue.length >= 8) {
      setFontSize(50);
    } else {
      setFontSize(80);
    }

    let newEqnArr = [...equationArray];
    let operators = ['+', '-', 'x', '/'];
    // calculation logic
    if (Number.isInteger(value) || value === '.') {
      if (value !== '.' || answerValue !== '.') {
        newEqnArr = handleNumber(value);
        setReadyToReplace(false);
      }
    } else if (value === 'C') {
      setAnswerValue('0');
      setMemoryValue('0');
      setOperatorValue('0');
      setReadyToReplace(true);
      setFontSize(80);

      // reset equation array
      newEqnArr = [];

    } else if (value === '+' || value === '-' || value === 'x' || value === '/') {
      newEqnArr = [...equationArray];
      // only allow new operator if last value wasn't an operator
      if (newEqnArr.length > 0) {
        let operators = ['+', '-', 'x', '/'];
        if (!operators.includes(newEqnArr[newEqnArr.length-1])) {
          if (operatorValue !== '0') {
            setMemoryValue(calculateEquals());
          } else {
            setMemoryValue(answerValue);
          }
          setReadyToReplace(true);
          setOperatorValue(value);

          // push operator value to equation array
          if (newEqnArr.length === 0) {
            newEqnArr.push(answerValue);
            newEqnArr.push(value);
          } else {
            newEqnArr.push(value);
          }
        }
      }

    } else if (value === '=') {
      // only allow if last wasn't an operator
      newEqnArr = [...equationArray];
      if (!operators.includes(newEqnArr[newEqnArr.length-1])) {
        let calculatedValue = calculateEquals();
        setMemoryValue('0');
        setOperatorValue('0');
        setReadyToReplace(true);
        setAnswerValue(calculatedValue);
        newEqnArr = [calculatedValue];
      }

    } else if (value === '+/-') {
      // only allow if last wasn't an operator
      // replace last value in equation array with new answer value
      newEqnArr = [...equationArray];
      if (!operators.includes(newEqnArr[newEqnArr.length-1])) {
        let newValue;
        if (answerValue < 0) {
          newValue = Math.abs(answerValue);
        } else if (answerValue > 0) {
          newValue = 0 - Math.abs(answerValue);
        }
        setAnswerValue(newValue);
        newEqnArr.pop()
        newEqnArr.push(newValue.toString());
      }

    } else if (value === '%') {
      // only allow if last wasn't an operator
      // replace last value in equation array with new answer value
      newEqnArr = [...equationArray];
      if (!operators.includes(newEqnArr[newEqnArr.length-1])) {
        let newValue = answerValue * 0.01;
        setAnswerValue(newValue);
        newEqnArr.pop()
        newEqnArr.push(newValue.toString());
      }
    }

    // Update the equation
    setEquationArray(newEqnArr);
    let equation = '';
    for (let i=0; i<newEqnArr.length; i++) {
      equation = equation + newEqnArr[i];
    }
    setEquation(equation);
  }

  const handleNumber = (value) => {
    let newEqnArr;
    if (readyToReplace) {
      setAnswerValue(value.toString());

      newEqnArr = [...equationArray];

      // if last action was press equals, we have one number in equation array,
      // therefore we need to replace that number
      if (newEqnArr.length === 1) {
        newEqnArr.pop();
      }
      // push new value to equation array
      newEqnArr.push(value.toString());
    } else {
      setAnswerValue(answerValue.toString()+value.toString());

      // replace last value in equation array with new answer value
      newEqnArr = [...equationArray];
      newEqnArr.pop()
      newEqnArr.push(answerValue.toString()+value.toString());
    }
    return newEqnArr;
  }

  const calculateEquals = () => {
    let previous = parseFloat(memoryValue);
    let current = parseFloat(answerValue);
    switch(operatorValue) {
      case '+':
        return previous + current;
      case '-':
        return previous - current;
      case 'x':
        return previous * current;
      case '/':
        return previous / current;
      default:
        return current;
    }
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.equation}>{equation}</Text>
        <Text style={[styles.result, {fontSize: fontSize}]}>{answerValue}</Text>
        <View style={styles.row}>
          <TouchableOpacity style={[styles.btn, styles.grey]} onPress={()=>buttonPressed('C')}>
            <Text style={styles.darkBtnTxt}>C</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.grey]} onPress={()=>buttonPressed('+/-')}>
            <Text style={styles.darkBtnTxt}>+/-</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.grey]} onPress={()=>buttonPressed('%')}>
            <Text style={styles.darkBtnTxt}>%</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.blue]} onPress={()=>buttonPressed('/')}>
            <Text style={styles.btnTxt}>/</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={[styles.btn, styles.darkGrey]} onPress={()=>buttonPressed(7)}>
            <Text style={styles.btnTxt}>7</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.darkGrey]} onPress={()=>buttonPressed(8)}>
            <Text style={styles.btnTxt}>8</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.darkGrey]} onPress={()=>buttonPressed(9)}>
            <Text style={styles.btnTxt}>9</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.blue]} onPress={()=>buttonPressed('x')}>
            <Text style={styles.btnTxt}>x</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={[styles.btn, styles.darkGrey]} onPress={()=>buttonPressed(4)}>
            <Text style={styles.btnTxt}>4</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.darkGrey]} onPress={()=>buttonPressed(5)}>
            <Text style={styles.btnTxt}>5</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.darkGrey]} onPress={()=>buttonPressed(6)}>
            <Text style={styles.btnTxt}>6</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.blue]} onPress={()=>buttonPressed('-')}>
            <Text style={styles.btnTxt}>-</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={[styles.btn, styles.darkGrey]} onPress={()=>buttonPressed(1)}>
            <Text style={styles.btnTxt}>1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.darkGrey]} onPress={()=>buttonPressed(2)}>
            <Text style={styles.btnTxt}>2</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.darkGrey]} onPress={()=>buttonPressed(3)}>
            <Text style={styles.btnTxt}>3</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.blue]} onPress={()=>buttonPressed('+')}>
            <Text style={styles.btnTxt}>+</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
        <TouchableOpacity style={[styles.longBtn, styles.darkGrey]} onPress={()=>buttonPressed(0)}>
          <Text style={styles.btnTxt}>0</Text>
        </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.darkGrey]} onPress={()=>buttonPressed('.')}>
            <Text style={styles.btnTxt}>.</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.blue]} onPress={()=>buttonPressed('=')}>
            <Text style={styles.btnTxt}>=</Text>
          </TouchableOpacity>
        </View>
        <StatusBar style="light" />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  equation: {
    color: 'white',
    fontSize: 40,
    marginRight: '5%'
  },
  result: {
    color: 'white',
    marginRight: '5%'
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    borderColor: 'white',
    borderRadius: 5
  },
  btn: {
    width: windowWidth*0.225,
    height: windowWidth*0.225,
    margin: windowWidth*0.0125,
    borderRadius: windowWidth*0.1125,
    justifyContent: 'center',
    alignItems: 'center'
  },
  longBtn: {
    width: windowWidth*0.475,
    height: windowWidth*0.225,
    margin: windowWidth*0.0125,
    borderRadius: windowWidth*0.1125,
    justifyContent: 'center',
    paddingLeft: windowWidth*0.09
  },
  blue: {
    backgroundColor: '#0d6191',
    borderWidth: 3,
    borderColor: 'darkblue'
  },
  grey: {
    backgroundColor: 'grey',
    borderWidth: 3,
    borderColor: 'white'
  },
  darkGrey: {
    backgroundColor: '#474747',
    borderWidth: 3,
    borderColor: 'red'
  },
  btnTxt: {
    fontSize: 35,
    color: 'white',
    textShadowColor: 'black',
    textShadowRadius: 20
  },
  darkBtnTxt: {
    fontSize: 35,
    color: 'black',
    textShadowColor: 'white'
  }
});
