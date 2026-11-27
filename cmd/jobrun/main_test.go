package main

import (
	"reflect"
	"testing"
)

func TestParseArgs(t *testing.T) {
	for _, tc := range []struct {
		name string
		args []string
		want invocation
	}{
		{"command", []string{"backup", "--", "true"}, invocation{"backup", []string{"true"}}},
		{"preserves arguments", []string{"backup", "--", "echo", "--help", "a b", ""}, invocation{"backup", []string{"echo", "--help", "a b", ""}}},
		{"no arguments", nil, invocation{}},
		{"no job ID", []string{"--", "true"}, invocation{}},
		{"no separator", []string{"backup", "true", "arg"}, invocation{}},
		{"no command", []string{"backup", "--"}, invocation{}},
		{"empty command", []string{"backup", "--", ""}, invocation{}},
	} {
		t.Run(tc.name, func(t *testing.T) {
			got, err := parseArgs(tc.args)
			if got.jobID != tc.want.jobID || !reflect.DeepEqual(got.command, tc.want.command) || (err != nil) != (tc.want.jobID == "") {
				t.Fatalf("parseArgs(%q) = %#v, %v; want %#v", tc.args, got, err, tc.want)
			}
		})
	}
}
